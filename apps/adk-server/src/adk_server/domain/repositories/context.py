# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from collections.abc import AsyncIterator
from datetime import datetime
from typing import Protocol
from uuid import UUID

from adk_server.domain.models.common import PaginatedResult
from adk_server.domain.models.context import Context


class IContextRepository(Protocol):
    def list(
        self, user_id: UUID | None = None, last_active_before: datetime | None = None
    ) -> AsyncIterator[Context]: ...
    async def list_paginated(
        self,
        *,
        user_id: UUID | None = None,
        provider_id: UUID | None = None,
        limit: int = 20,
        page_token: UUID | None = None,
        order: str = "desc",
        order_by: str = "created_at",
        include_empty: bool = True,
        last_active_before: datetime | None = None,
    ) -> PaginatedResult: ...
    async def create(self, *, context: Context) -> None: ...
    async def get(self, *, context_id: UUID, user_id: UUID | None = None) -> Context: ...
    async def update(self, *, context: Context) -> None: ...
    async def delete(self, *, context_id: UUID, user_id: UUID | None = None) -> int: ...
    async def update_last_active(self, *, context_id: UUID) -> None: ...
