# Copyright 2025 © BeeAI a Series of LF Projects, LLC
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import ast
import enum
import json
import re
import sys
from pathlib import Path
from typing import Any
from pydantic import BaseModel, ConfigDict

import argparse

import griffe

class ExportItem(BaseModel):
    model_config = ConfigDict(validate_assignment=True)
    name: str
    origin: str
    kind: str | None = None
    docstring: str | None = None
    annotation: str | None = None
    definition: str | None = None
    default: str | None = None
    params: list[dict[str, Any]] | None = None
    returns: str | None = None
    bases: list[str] | None = None
    class_attributes: list[dict[str, Any]] | None = None
    attributes: list[dict[str, Any]] | None = None
    methods: list[dict[str, Any]] | None = None
    labels: list[str] | None = None


def parse_allnames(tree: ast.Module) -> list[str]:
    """Extract string names from a top-level __all__ = [...] assignment."""
    for node in tree.body:
        if (
            isinstance(node, ast.Assign)
            and len(node.targets) == 1
            and isinstance(node.targets[0], ast.Name)
            and node.targets[0].id == "__all__"
            and isinstance(node.value, ast.List)
        ):
            return [
                elt.value
                for elt in node.value.elts
                if isinstance(elt, ast.Constant) and isinstance(elt.value, str)
            ]
    return []


def resolve_absolute(module_path: str) -> Path | None:
    """
    Resolve an absolute dotted module path to a filesystem path, but only
    if the module lives inside the same package (SRC_ROOT).
    """
    pkg_name = SRC_ROOT.name  # e.g. "agentstack_sdk"
    if not module_path.startswith(pkg_name):
        return None
    parts = module_path.split(".")
    candidate: Path = SRC_ROOT.parent
    for part in parts:
        candidate = candidate / part
    if (candidate / "__init__.py").exists():
        return candidate
    if candidate.with_suffix(".py").exists():
        return candidate.with_suffix(".py")
    return None


def resolve_relative(current_pkg_path: Path, level: int, module_suffix: str | None) -> Path | None:
    """
    Resolve a relative import to an absolute filesystem path.

    current_pkg_path: directory of the package containing the importing file
    level:            number of leading dots (1 = current package, 2 = parent, ...)
    module_suffix:    the `X.Y` part after the dots, or None
    Returns: Path to the resolved .py file or package directory, or None if not found.
    """
    base = current_pkg_path
    for _ in range(level - 1):
        base = base.parent

    if module_suffix:
        parts = module_suffix.split(".")
        candidate = base
        for part in parts:
            candidate = candidate / part
    else:
        candidate = base

    # Prefer package (directory with __init__.py) over plain module
    if (candidate / "__init__.py").exists():
        return candidate
    if candidate.with_suffix(".py").exists():
        return candidate.with_suffix(".py")
    return None


def collect_exports(path: Path, visited: set[str] | None = None) -> list[ExportItem]:
    """
    Recursively collect effective exports from a file or package directory.

    path: either a .py file or a package directory (containing __init__.py)
    Returns a deduplicated list of ExportItem(name, origin).
    """
    if visited is None:
        visited = set()

    # Normalise to the actual file we'll parse
    if path.is_dir():
        parse_file = path / "__init__.py"
        pkg_dir = path
    else:
        parse_file = path
        pkg_dir = path.parent

    str_path = str(parse_file)
    if str_path in visited:
        return []
    visited.add(str_path)

    if not parse_file.exists():
        return []

    source = parse_file.read_text()
    try:
        tree = ast.parse(source)
    except SyntaxError as exc:
        print(f"  ⚠  SyntaxError in {parse_file}: {exc}", file=sys.stderr)
        return []

    exports: list[ExportItem] = []
    origin = _path_to_module(parse_file)

    # ── 1. Check for an explicit __all__ ────────────────────────────────────
    declared = parse_allnames(tree)
    if declared:
        for name in declared:
            exports.append(ExportItem(name=name, origin=origin))
        # An explicit __all__ is the final word – no need to follow star imports
        return _deduplicate(exports)

    # ── 2. No __all__: follow star imports, explicit re-exports, and local definitions ───────────
    for node in tree.body:
        # ── locally defined classes ──────────────────────────────────────────
        if isinstance(node, ast.ClassDef):
            if not node.name.startswith("_"):
                exports.append(ExportItem(name=node.name, origin=origin))
            continue

        # ── locally defined functions ────────────────────────────────────────
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            if not node.name.startswith("_"):
                exports.append(ExportItem(name=node.name, origin=origin))
            continue

        # ── module-level assignments (constants and variables) ───────────────
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and not target.id.startswith("_"):
                    exports.append(ExportItem(name=target.id, origin=origin))
            continue

        if isinstance(node, ast.AnnAssign):
            target = node.target
            if isinstance(target, ast.Name) and not target.id.startswith("_"):
                exports.append(ExportItem(name=target.id, origin=origin))
            continue

        if not isinstance(node, ast.ImportFrom):
            continue

        # Only handle relative imports (level > 0)
        if node.level == 0:
            # ── absolute star import from within the same package ────────────
            if node.names and node.names[0].name == "*" and node.module:
                resolved_abs = resolve_absolute(node.module)
                if resolved_abs is not None:
                    child_exports = collect_exports(resolved_abs, visited)
                    exports.extend(child_exports)
            else:
                # Capture intentional `Name as Name` re-exports
                for alias in node.names:
                    if alias.name != "*" and alias.asname == alias.name:
                        exports.append(ExportItem(name=alias.name, origin=node.module or ""))
            continue

        # ── relative wildcard: `from .X import *` ───────────────────────────
        resolved = resolve_relative(pkg_dir, node.level, node.module)
        if node.names[0].name == "*":
            if resolved is None:
                print(
                    f"  ⚠  Cannot resolve relative import "
                    f"{'.' * node.level}{node.module or ''} in {parse_file}",
                    file=sys.stderr,
                )
                continue
            child_exports = collect_exports(resolved, visited)
            exports.extend(child_exports)

        # ── relative explicit: `from .X import Name as Name` ────────────────
        else:
            resolved_module = _path_to_module(resolved) if resolved else (node.module or "")
            for alias in node.names:
                if alias.name != "*":
                    exports.append(ExportItem(name=alias.asname or alias.name, origin=resolved_module))

    return _deduplicate(exports)


def _path_to_module(path: Path | None) -> str:
    """Convert an absolute path under SRC_ROOT.parent to a dotted module name."""
    if path is None:
        return ""
    try:
        rel = path.relative_to(SRC_ROOT.parent)
    except ValueError:
        return str(path)
    parts = list(rel.parts)
    if parts[-1] == "__init__.py":
        parts = parts[:-1]
    elif parts[-1].endswith(".py"):
        parts[-1] = parts[-1][:-3]
    return ".".join(parts)


def _deduplicate(exports: list[ExportItem]) -> list[ExportItem]:
    seen: set[str] = set()
    result: list[ExportItem] = []
    for exp in exports:
        if exp.name not in seen:
            seen.add(exp.name)
            result.append(exp)
    return result


def _init_imports_file(init_file: Path, module_stem: str) -> bool:
    """
    Return True if *init_file* contains any import that explicitly references
    a sibling module named *module_stem* (e.g. "types").

    Matches relative imports of the form:
      from .types import ...
      from . import types
    """
    if not init_file.exists():
        return False
    try:
        tree = ast.parse(init_file.read_text())
    except SyntaxError:
        return False
    for node in tree.body:
        if not isinstance(node, ast.ImportFrom):
            continue
        if node.level == 0:
            continue
        # `from .types import ...`  →  node.module == "types"
        if node.module == module_stem:
            return True
        # `from . import types`  →  node.module is None, names contain "types"
        if node.module is None and any(alias.name == module_stem for alias in node.names):
            return True
    return False


def trace_package(root: Path) -> dict[str, list[ExportItem]]:
    """
    Walk every __init__.py in the package and compute its effective public API.
    Also picks up flat .py modules anywhere in the package tree that are NOT
    already referenced (imported) by the sibling __init__.py.
    Returns {dotted_module_path: [ExportItem, ...]}.
    """
    result: dict[str, list[ExportItem]] = {}

    for init_file in sorted(root.rglob("__init__.py")):
        if "__pycache__" in init_file.parts:
            continue
        pkg_dir = init_file.parent
        module_name = _path_to_module(pkg_dir)
        exports = collect_exports(pkg_dir)  # fresh visited set per package
        result[module_name] = exports

    # Also pick up flat .py modules anywhere in the package tree (e.g. a2a/types.py).
    # Skip a file if the sibling __init__.py already imports from it — those
    # exports are already captured via the package entry above.
    for py_file in sorted(root.rglob("*.py")):
        if py_file.name == "__init__.py" or py_file.name.startswith("_"):
            continue
        if "__pycache__" in py_file.parts:
            continue
        module_name = _path_to_module(py_file)
        if module_name in result:
            continue
        sibling_init = py_file.parent / "__init__.py"
        if _init_imports_file(sibling_init, py_file.stem):
            continue
        exports = collect_exports(py_file)
        if exports:
            result[module_name] = exports

    return result


# ── Griffe enrichment ──────────────────────────────────────────────────────


def _fmt_annotation(ann: Any) -> str | None:
    """Stringify a griffe annotation, keeping package prefixes."""
    if ann is None:
        return None
    s = str(ann)
    return s or None


def _fmt_docstring(ds: griffe.Docstring | None) -> str | None:
    if not ds or not ds.value:
        return None
    text = ds.value.strip()
    return text


FILTER_FUNCTION_LABELS = {"module-attribute"}

def _serialize_function(fn: griffe.Function) -> dict[str, Any]:
    params = []
    for p in fn.parameters:
        if p.name in ("self", "cls"):
            continue
        entry: dict[str, Any] = {"name": p.name}
        if p.annotation:
            entry["type"] = _fmt_annotation(p.annotation)
        if p.default is not None and str(p.default) not in ("None", "PosOnlyArgsSep", "KwOnlyArgsSep"):
            entry["default"] = str(p.default)
        entry["kind"] = p.kind.value if p.kind and hasattr(p.kind, "value") else str(p.kind)
        params.append(entry)

    result: dict[str, Any] = {"kind": "function", "params": params}
    if fn.returns:
        result["returns"] = _fmt_annotation(fn.returns)
    doc = _fmt_docstring(fn.docstring)
    if doc:
        result["docstring"] = doc
    if fn.labels:
        result["labels"] = sorted(str(l) for l in fn.labels if str(l) not in FILTER_FUNCTION_LABELS)
    return result


def _identify_arguments_from_init(method: griffe.Function) -> list[dict[str, Any]]:
    assigns: list[dict[str, Any]] = []
    try:
        src = method.source
        if src:
            tree = ast.parse(src)
            for node in ast.walk(tree):
                if isinstance(node, ast.Assign):
                    for target in node.targets:
                        if (
                            isinstance(target, ast.Attribute)
                            and isinstance(target.value, ast.Name)
                            and target.value.id == "self"
                            and not target.attr.startswith("_")
                        ):
                            assigns.append({"name": target.attr})
                elif isinstance(node, ast.AnnAssign):
                    if (
                        isinstance(node.target, ast.Attribute)
                        and isinstance(node.target.value, ast.Name)
                        and node.target.value.id == "self"
                        and not node.target.attr.startswith("_")
                    ):
                        entry: dict[str, Any] = {"name": node.target.attr}
                        if node.annotation:
                            entry["type"] = ast.unparse(node.annotation)
                        assigns.append(entry)
    except Exception:
        pass
    return assigns


def _is_factory_classmethod(method: griffe.Function, class_name: str) -> bool:
    """
    Return True if *method* is a @classmethod whose return annotation is
    exactly "Self" or the enclosing class name.
    """
    if "classmethod" not in {str(l) for l in method.labels}:
        return False
    ret = _fmt_annotation(method.returns)
    if not ret:
        return False

    core = ret.strip()
    # Accept bare "Self" or any qualified variant (typing.Self, typing_extensions.Self)
    # as well as the exact class name.
    return core in (class_name, "Self") or core.endswith(".Self")


def _serialize_class(cls: griffe.Class) -> dict[str, Any]:
    result: dict[str, Any] = {"kind": "class"}

    bases = [_fmt_annotation(b) for b in cls.bases if _fmt_annotation(b) not in ("object", None)]
    if bases:
        result["bases"] = bases

    doc = _fmt_docstring(cls.docstring)
    if doc:
        result["docstring"] = doc

    # Fields (class-level attributes, excluding private and dunder)
    class_attrs = []
    for name, member in cls.members.items():
        if name.startswith("_"):
            continue
        actual = member

        if isinstance(member, griffe.Alias):
            try:
                actual = member.target
            except Exception:
                continue

        if actual.kind.name != "ATTRIBUTE":
            continue
        field: dict[str, Any] = {"name": name}
        ann = getattr(actual, "annotation", None)
        if ann:
            field["type"] = _fmt_annotation(ann)
        field_doc = _fmt_docstring(actual.docstring)
        if field_doc:
            field["docstring"] = field_doc
        val = getattr(actual, "value", None)
        if val is not None:
            v = str(val)
            if len(v) <= 120:
                field["default"] = v
        class_attrs.append(field)
    if class_attrs:
        result["class_attributes"] = class_attrs

    # Public methods (excluding dunder, but including __init__)
    methods = []
    for name, member in cls.members.items():
        if name.startswith("_") and name != "__init__":
            continue
        actual = member
        if member.kind.name == "ALIAS":
            if hasattr(member, "target"):
                actual = member.target
            else:
                continue
        if actual.kind.name != "FUNCTION":
            continue
        method_info: dict[str, Any] = {"name": name}
        if name == "__init__":
            method_info["kind"] = "constructor"
            # Find self.attribute assignments in the __init__ body
            assigned_attributes = _identify_arguments_from_init(actual)  # pyrefly: ignore[bad-argument-type]
            if assigned_attributes:
                class_attrs_names = {attr["name"] for attr in class_attrs}
                result["attributes"] = [aa for aa in assigned_attributes if aa["name"] not in class_attrs_names]

        elif _is_factory_classmethod(actual, cls.name):  # pyrefly: ignore[bad-argument-type]
            method_info["kind"] = "constructor"
        else:
            method_info["kind"] = "method"
        params = []
        if hasattr(actual, "parameters") and actual.parameters:
            for p in actual.parameters:
                if p.name in ("self", "cls"):
                    continue
                pe: dict[str, Any] = {"name": p.name}
                if p.annotation:
                    pe["type"] = _fmt_annotation(p.annotation)
                if p.default is not None and str(p.default) not in ("None", "PosOnlyArgsSep", "KwOnlyArgsSep"):
                    d = str(p.default)
                    pe["default"] = d if len(d) <= 80 else "..."
                params.append(pe)
        if params:
            method_info["params"] = params
        if hasattr(actual, "returns") and actual.returns:
            method_info["returns"] = _fmt_annotation(actual.returns)
        method_doc = _fmt_docstring(actual.docstring)
        if method_doc:
            method_info["docstring"] = method_doc
        if actual.labels:
            method_info["labels"] = sorted(str(l) for l in actual.labels)
        methods.append(method_info)
    if methods:
        result["methods"] = methods

    return result


def _is_constant(name: str) -> bool:
    """Check if a name follows the UPPER_SNAKE_CASE constant convention."""
    return bool(re.match(r'^[A-Z0-9_]+$', name))


def _is_callable_annotation(ann_str: str | None) -> bool:
    """Return True if the annotation string represents a Callable type."""
    if not ann_str:
        return False
    return bool(re.match(r'^(typing\.)?Callable\b', ann_str))

import enum

class TypingKind(str, enum.Enum):
    SPECIAL_FORM = "special_form"
    TYPE_VAR = "type_var"
    NEW_TYPE = "new_type"
    TYPE_ALIAS = "type_alias"        # PEP 613 / PEP 695 explicit alias
    UNION_ALIAS = "union_alias"      # A | B style


_SPECIAL_FORM_PREFIXES = [
    "Literal[",
    "Union[",
    "Optional[",
    "Annotated[",
    "Final[",
    "ClassVar[",
    "Concatenate[",
]

_VALUE_PREFIX_TO_KIND: list[tuple[str, TypingKind]] = [
    *(("typing." + p, TypingKind.SPECIAL_FORM) for p in _SPECIAL_FORM_PREFIXES),
    *((p, TypingKind.SPECIAL_FORM) for p in _SPECIAL_FORM_PREFIXES),
    ("typing.TypeVar(", TypingKind.TYPE_VAR),
    ("TypeVar(",        TypingKind.TYPE_VAR),
    ("typing.NewType(", TypingKind.NEW_TYPE),
    ("NewType(",        TypingKind.NEW_TYPE),
]

_TYPE_ALIAS_ANNOTATION_NAMES = {"TypeAlias", "typing.TypeAlias", "typing_extensions.TypeAlias"}

_UNION_TYPE_ALIAS_RE = re.compile(r"^[\w][\w\[\]., ]*(\s*\|\s*[\w][\w\[\]., ]*)+$")


def _get_typing_kind(attr: griffe.Attribute) -> str | None:
    """Return the TypingKind of the attribute, or None if it's not a typing construct."""
    ann = getattr(attr, "annotation", None)
    ann_str = _fmt_annotation(ann)

    # PEP 613 explicit: `Foo: TypeAlias = ...`
    if ann_str and ann_str in _TYPE_ALIAS_ANNOTATION_NAMES:
        return TypingKind.TYPE_ALIAS

    val = getattr(attr, "value", None)
    if val is None:
        return None

    val_str = str(val).strip()

    for prefix, kind in _VALUE_PREFIX_TO_KIND:
        if val_str.startswith(prefix):
            return kind

    if _UNION_TYPE_ALIAS_RE.match(val_str):
        return TypingKind.UNION_ALIAS

    return None


def _serialize_attribute(attr: griffe.Attribute, name: str = "") -> dict[str, Any]:
    """
    Serialize a module-level attribute/variable or constant.

    Callable-annotated attributes are serialised with kind="function".
    Type alias assignments (typing.Literal, Union, TypeVar, etc.) are
    serialised with kind="type_alias" and the actual type expression as "type".
    Other attributes are distinguished as constants (UPPER_SNAKE_CASE) or
    regular variables.
    """
    ann = getattr(attr, "annotation", None)
    ann_str = _fmt_annotation(ann)

    if _is_callable_annotation(ann_str):
        result: dict[str, Any] = {"kind": "function", "annotation": ann_str}
        doc = _fmt_docstring(attr.docstring)
        if doc:
            result["docstring"] = doc
        if attr.labels:
            result["labels"] = sorted(str(l) for l in attr.labels if str(l) not in FILTER_FUNCTION_LABELS)
        return result

    if typing_kind := _get_typing_kind(attr):
        val = getattr(attr, "value", None)
        type_str = str(val).strip() if val is not None else ann_str
        result = {"kind": typing_kind}
        if type_str:
            result["definition"] = type_str
        doc = _fmt_docstring(attr.docstring)
        if doc:
            result["docstring"] = doc
        return result

    kind = "constant" if _is_constant(name) else "attribute"
    result: dict[str, Any] = {"kind": kind}
    ann = getattr(attr, "annotation", None)
    if ann:
        result["annotation"] = _fmt_annotation(ann)
    val = getattr(attr, "value", None)
    if val is not None:
        v = str(val)
        if len(v) <= 200:
            result["value"] = v
    doc = _fmt_docstring(attr.docstring)
    if doc:
        result["docstring"] = doc
    return result


def _lookup_griffe(pkg: griffe.Module, dotted_path: str, name: str) -> griffe.Object | None:
    """Resolve dotted_path in the griffe module tree, then look up name."""
    try:
        obj = pkg
        # Strip the leading "agentstack_sdk." prefix if present
        relative = dotted_path.removeprefix("agentstack_sdk.")
        if relative and relative != "agentstack_sdk":
            for part in relative.split("."):
                obj = obj[part]
        return obj[name]
    except (KeyError, TypeError):
        return None


_LOGGER_TYPE_NAMES = {"logging.Logger", "Logger", "logging.RootLogger", "RootLogger", "TypeVar", "typing.TypeVar"}


def _is_unwanted_attribute(attr: griffe.Attribute) -> bool:
    """Return True if the attribute is a logging.Logger instance."""
    ann = getattr(attr, "annotation", None)
    ann_str = _fmt_annotation(ann)
    if ann_str and ann_str in _LOGGER_TYPE_NAMES:
        return True
    # Fallback: check the value expression (e.g. `logging.getLogger(...)`)
    type_filter = {
        "logging.getLogger",
        "getLogger",
        "TypeVar",
        "typing.TypeVar",
    }
    val = getattr(attr, "value", None)
    if val is not None:
        val_str = str(val).strip()
        if any(val_str.startswith(f"{prefix}(") for prefix in type_filter):
            return True
    return False


def enrich_api(
    api: dict[str, list[ExportItem]],
    pkg: griffe.Module,
) -> dict[str, list[dict[str, Any]]]:
    """
    For every ExportItem in *api*, look up the object in the griffe tree and
    attach rich metadata.  Returns a JSON-serialisable dict.
    """
    result: dict[str, list[dict[str, Any]]] = {}

    for module_path, exports in sorted(api.items()):
        if not exports:
            continue
        enriched_exports = []
        for exp in exports:
            member = _lookup_griffe(pkg, exp.origin, exp.name)

            # Resolve through aliases
            if member is not None and member.kind.name == "ALIAS":
                if hasattr(member, "target"):
                    member = member.target
                else:
                    member = None

            if member is None:
                exp.kind = "unknown"
                enriched_exports.append(exp.model_dump(exclude_none=True))
                continue

            kind = member.kind.name
            if kind == "CLASS":
                exp = exp.model_copy(update=_serialize_class(member))  # pyrefly: ignore[bad-argument-type]
            elif kind == "FUNCTION":
                exp = exp.model_copy(update=_serialize_function(member))  # pyrefly: ignore[bad-argument-type]
            elif kind == "ATTRIBUTE":
                if _is_unwanted_attribute(member):  # pyrefly: ignore[bad-argument-type]
                    continue
                exp = exp.model_copy(update=_serialize_attribute(member, exp.name))  # pyrefly: ignore[bad-argument-type]
            else:
                exp.kind = kind.lower()
                doc = _fmt_docstring(getattr(member, "docstring", None))
                if doc:
                    exp.docstring = doc

            enriched_exports.append(exp.model_dump(exclude_none=True))
        result[module_path] = enriched_exports

    return result


SRC_ROOT = ""


def main() -> None:
    parser = argparse.ArgumentParser(description="Introspect agentstack-sdk-py exports and emit a JSON manifest.")
    parser.add_argument(
        "--src-root",
        type=Path,
        help="Path to the agentstack_sdk package source directory",
    )
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        default=Path(__file__).resolve().parent / "exports_structure.json",
        help="Path where the JSON manifest will be written (default: <script-dir>/exports_structure.json)",
    )
    args = parser.parse_args()

    # Allow helper functions (resolve_absolute, _path_to_module) to use the
    # correct source root when --src-root is overridden. 
    global SRC_ROOT
    SRC_ROOT = args.src_root.resolve()

    if not SRC_ROOT.exists():
        sys.exit(f"Package source not found at {SRC_ROOT}")

    # ── Phase 1: star-import tracing ─────────────────────────────────────────
    api = trace_package(SRC_ROOT)

    # ── Phase 2: griffe enrichment ───────────────────────────────────────────
    pkg = griffe.load("agentstack_sdk", search_paths=[str(SRC_ROOT.parent)])
    enriched = enrich_api(api, pkg)

    out_file: Path = args.output
    out_file.parent.mkdir(parents=True, exist_ok=True)
    out_file.write_text(json.dumps(enriched, indent=2))

    pkg_count = len(enriched)
    name_count = sum(len(v) for v in enriched.values())
    print(f"Python SDK: Extracted {pkg_count} packages · {name_count} total exports")


if __name__ == "__main__":
    main()