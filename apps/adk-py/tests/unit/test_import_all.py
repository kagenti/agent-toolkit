# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import importlib
import pkgutil

import pytest

import kagenti_adk


@pytest.mark.unit
def test_import_all():
    """
    Recursively import all packages from kagenti_adk to ensure no syntax errors
    or missing dependencies.
    """
    package = kagenti_adk
    prefix = package.__name__ + "."

    for _, name, _ in pkgutil.walk_packages(package.__path__, prefix):
        try:
            importlib.import_module(name)
            print("imported", name)
        except Exception:
            print("failed to import", name)
            raise
