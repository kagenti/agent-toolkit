# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from collections.abc import AsyncGenerator
from typing import Annotated

from a2a.types import Message

from kagenti_adk.a2a.extensions import (
    LLMServiceExtensionServer,
    LLMServiceExtensionSpec,
    PlatformApiExtensionServer,
    PlatformApiExtensionSpec,
    TrajectoryExtensionServer,
    TrajectoryExtensionSpec,
)
from kagenti_adk.a2a.types import AuthRequired, RunYield
from kagenti_adk.platform import File
from kagenti_adk.server import Server
from kagenti_adk.server.context import RunContext

server = Server()


@server.agent()
async def dependent_agent(
    message: Message,
    context: RunContext,
    trajectory: Annotated[TrajectoryExtensionServer, TrajectoryExtensionSpec()],
    # does not typecheck, does not ruff check
    llm: Annotated[LLMServiceExtensionServer, LLMServiceExtensionSpec.single_demand()],
    _: Annotated[PlatformApiExtensionServer, PlatformApiExtensionSpec()],
) -> AsyncGenerator[RunYield, Message]:
    """Awaits a user message"""

    await File.create(filename="my_file.txt", content=b"hello world", content_type="text/plain")

    yield trajectory.trajectory_metadata(title="context_param", content=str(context))
    yield trajectory.trajectory_metadata(title="message_param", content=str(message.model_dump()))
    yield trajectory.message(trajectory_title="llm_param", trajectory_content=str(llm.data))

    message = yield AuthRequired(text="give me auth")
    yield trajectory.message(trajectory_title="follow up message", trajectory_content=str(message))


if __name__ == "__main__":
    server.run(self_registration=False)
