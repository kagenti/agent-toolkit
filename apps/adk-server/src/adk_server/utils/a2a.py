# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from typing import Any


def get_extension(agent_card: Any, uri: str) -> Any | None:
    """Get an extension by URI from an agent card (protobuf or dict)."""
    try:
        if isinstance(agent_card, dict):
            extensions = agent_card.get("capabilities", {}).get("extensions", [])
            return next(ext for ext in extensions if ext.get("uri") == uri)
        else:
            return next(ext for ext in agent_card.capabilities.extensions if ext.uri == uri)
    except StopIteration:
        return None
