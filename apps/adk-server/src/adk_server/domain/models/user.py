# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from enum import StrEnum
from uuid import UUID, uuid4

from pydantic import AwareDatetime, BaseModel, EmailStr, Field

from adk_server.utils.utils import utc_now


class UserRole(StrEnum):
    ADMIN = "admin"
    DEVELOPER = "developer"
    USER = "user"


class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    role: UserRole = UserRole.USER
    email: EmailStr
    created_at: AwareDatetime = Field(default_factory=utc_now)
