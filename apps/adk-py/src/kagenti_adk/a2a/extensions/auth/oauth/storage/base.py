# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import abc

from mcp.client.auth import TokenStorage


class TokenStorageFactory(abc.ABC):
    @abc.abstractmethod
    async def create_storage(self) -> TokenStorage: ...
