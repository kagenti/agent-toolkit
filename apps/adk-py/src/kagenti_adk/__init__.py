# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import os
from importlib.metadata import version

from kagenti_adk.util.pydantic import apply_compatibility_monkey_patching

__version__ = version("kagenti-adk")

apply_compatibility_monkey_patching()
if os.getenv("KAGENTI_ADK_DONT_INJECT_A2A_VALIDATION", "").lower() not in {"true", "1"}:
    from kagenti_adk.a2a.types import _inject_validation

    _inject_validation()
