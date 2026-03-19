# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from pydantic import BaseModel


class CreateDiscoveryRequest(BaseModel):
    docker_image: str
