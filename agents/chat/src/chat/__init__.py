# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

# Compatibility shims for agentstack-sdk + new protobuf-based a2a-sdk.
# agentstack-sdk was built against the old pydantic-based a2a-sdk and its
# platform/__init__.py eagerly imports modules (provider, file, etc.) that
# reference removed a2a types and use protobuf classes as pydantic fields.
# The chat agent only needs ModelProviderType from agentstack_sdk.platform,
# so we pre-populate sys.modules with a lightweight stub to skip the
# problematic wildcard imports entirely.

import importlib.util
import pathlib
import sys
import types

# 1. Patch a2a.types to return stubs for missing types (FilePart, FileWithUri, etc.)
import pydantic

import a2a.types as _a2a_types

_original_getattr = getattr(_a2a_types, "__getattr__", None)


def _a2a_types_getattr(name: str) -> type:
    if _original_getattr is not None:
        try:
            return _original_getattr(name)
        except AttributeError:
            pass
    return type(name, (pydantic.BaseModel,), {"model_config": pydantic.ConfigDict(extra="allow")})


_a2a_types.__getattr__ = _a2a_types_getattr  # type: ignore[attr-defined]

# 2. Stub agentstack_sdk.platform before its __init__.py runs.
#    Load model_provider.py directly by file path to avoid triggering the package init.
import agentstack_sdk  # noqa: E402

_sdk_path = pathlib.Path(agentstack_sdk.__file__).parent
_mp_file = _sdk_path / "platform" / "model_provider.py"

_platform_stub = types.ModuleType("agentstack_sdk.platform")
_platform_stub.__path__ = [str(_sdk_path / "platform")]  # type: ignore[attr-defined]
_platform_stub.__package__ = "agentstack_sdk.platform"
sys.modules["agentstack_sdk.platform"] = _platform_stub

_mp_spec = importlib.util.spec_from_file_location("agentstack_sdk.platform.model_provider", _mp_file)
if _mp_spec and _mp_spec.loader:
    _mod = importlib.util.module_from_spec(_mp_spec)
    sys.modules["agentstack_sdk.platform.model_provider"] = _mod
    _mp_spec.loader.exec_module(_mod)  # type: ignore[union-attr]
    _platform_stub.ModelProviderType = _mod.ModelProviderType  # type: ignore[attr-defined]
