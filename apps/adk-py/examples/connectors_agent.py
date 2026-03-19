# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from collections.abc import AsyncGenerator
from typing import Annotated

from a2a.types import Message
from mcp import ClientSession

from kagenti_adk.a2a.extensions import (
    MCPServiceExtensionServer,
    MCPServiceExtensionSpec,
    PlatformApiExtensionServer,
    PlatformApiExtensionSpec,
)
from kagenti_adk.a2a.types import RunYield
from kagenti_adk.server import Server
from kagenti_adk.server.context import RunContext

server = Server()


@server.agent()
async def connectors_agent(
    message: Message,
    context: RunContext,
    mcp: Annotated[
        MCPServiceExtensionServer,
        MCPServiceExtensionSpec.single_demand(),
    ],
    _: Annotated[PlatformApiExtensionServer, PlatformApiExtensionSpec()],
) -> AsyncGenerator[RunYield, Message]:
    """Lists tools"""

    if not mcp:
        yield "MCP extension hasn't been activated, no tools are available"
        return

    async with mcp.create_client() as client:
        if client is None:
            yield "MCP client not available."
            return

        read, write = client
        async with ClientSession(read_stream=read, write_stream=write) as session:
            await session.initialize()

            tools = await session.list_tools()

            yield "Available tools: \n"
            yield "\n".join([t.name for t in tools.tools])


if __name__ == "__main__":
    server.run()
