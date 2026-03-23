# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0
from __future__ import annotations

from typing import Final

from a2a.types import AgentInterface, AgentSkill

from kagenti_adk.a2a.extensions import BaseExtensionServer
from kagenti_adk.a2a.extensions.services.platform import PlatformApiExtensionServer, PlatformApiExtensionSpec
from kagenti_adk.a2a.extensions.ui.error import ErrorExtensionParams, ErrorExtensionServer, ErrorExtensionSpec

DEFAULT_IMPLICIT_EXTENSIONS: Final[dict[str, BaseExtensionServer]] = {
    ErrorExtensionSpec.URI: ErrorExtensionServer(ErrorExtensionSpec(ErrorExtensionParams())),
    PlatformApiExtensionSpec.URI: PlatformApiExtensionServer(PlatformApiExtensionSpec()),
}

_IMPLICIT_DEPENDENCY_PREFIX: Final = "___server_dep"
_DEFAULT_AGENT_INTERFACE: Final = AgentInterface(
    url="http://invalid", protocol_binding="invalid", protocol_version="1.0.0"
)
_DEFAULT_AGENT_SKILL: Final = AgentSkill(id="default", name="default", description="generic agent", tags=["default"])


__all__ = []
