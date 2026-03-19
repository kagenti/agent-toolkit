# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from uuid import UUID

from pydantic import AwareDatetime, BaseModel, EmailStr, Field

from adk_server.domain.models.user import UserRole


class UserListQuery(BaseModel):
    limit: int = Field(default=40, ge=1, le=100)
    page_token: UUID | None = None
    email: str | None = Field(default=None, description="Filter by email (case-insensitive partial match)")


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    role: UserRole
    created_at: AwareDatetime
