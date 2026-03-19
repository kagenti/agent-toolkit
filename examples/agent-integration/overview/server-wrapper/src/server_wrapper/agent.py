# Copyright 2025 © Kagenti a Series of LF Projects, LLC
# SPDX-License-Identifier: Apache-2.0

import os

from a2a.types import Message
from kagenti_adk.a2a.types import AgentMessage
from kagenti_adk.server import Server
from kagenti_adk.server.context import RunContext

server = Server()


@server.agent()
async def server_wrapper_example(input: Message, context: RunContext):
    """Your agent implementation"""
    yield AgentMessage(text="Hello from my agent!")


def run():
    server.run(host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", 8000)))


if __name__ == "__main__":
    run()
