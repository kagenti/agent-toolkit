# Copyright 2025 © Kagenti a Series of LF Projects, LLC
# SPDX-License-Identifier: Apache-2.0

import os
from typing import Annotated

from a2a.types import Message
from kagenti_adk.a2a.extensions import LLMServiceExtensionServer, LLMServiceExtensionSpec
from kagenti_adk.a2a.types import AgentMessage
from kagenti_adk.server import Server
from kagenti_adk.server.context import RunContext

server = Server()


@server.agent()
async def dependency_injection_example(
    input: Message,
    context: RunContext,
    llm: Annotated[LLMServiceExtensionServer, LLMServiceExtensionSpec.single_demand()],
):
    # The demand is fulfilled by the client - llm is provided if available
    if llm:
        # response = await llm.chat(messages=[...])
        # ...
        yield AgentMessage(text="LLM service is available.")
    else:
        yield AgentMessage(text="LLM service not available")


def run():
    server.run(host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", 8000)))


if __name__ == "__main__":
    run()
