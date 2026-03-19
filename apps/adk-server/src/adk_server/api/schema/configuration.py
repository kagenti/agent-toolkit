# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from pydantic import BaseModel


class UpdateConfigurationRequest(BaseModel):
    default_llm_model: str | None = None
    default_embedding_model: str | None = None
