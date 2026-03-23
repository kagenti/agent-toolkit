# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from kagenti_adk.a2a.extensions.base import BaseExtensionSpec


class ExtensionError(Exception):
    extension: BaseExtensionSpec

    def __init__(self, spec: BaseExtensionSpec, message: str):
        super().__init__(f"Exception in extension '{spec.URI}': \n{message}")
