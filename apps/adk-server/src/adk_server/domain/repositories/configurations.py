# Copyright 2025 © BeeAI a Series of LF Projects, LLC
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from typing import Protocol, runtime_checkable

from adk_server.domain.models.configuration import SystemConfiguration


@runtime_checkable
class IConfigurationsRepository(Protocol):
    async def get_system_configuration(self) -> SystemConfiguration: ...
    async def create_or_update_system_configuration(self, *, configuration: SystemConfiguration) -> None: ...
