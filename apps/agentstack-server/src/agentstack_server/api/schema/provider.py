# Copyright 2025 © BeeAI a Series of LF Projects, LLC
# SPDX-License-Identifier: Apache-2.0


from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from agentstack_server.domain.models.provider import ProviderLocation


class CreateProviderRequest(BaseModel):
    location: ProviderLocation
    agent_card: dict[str, Any] | None = None
    origin: str | None = Field(
        default=None,
        description=(
            "A unique origin of the provider: most often a url. "
            "This is used to determine multiple versions of the same agent."
        ),
    )
