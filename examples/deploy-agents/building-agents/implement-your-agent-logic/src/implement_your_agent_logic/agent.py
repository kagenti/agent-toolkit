# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

import os

from a2a.types import Message
from a2a.utils.message import get_message_text
from kagenti_adk.a2a.types import AgentMessage
from kagenti_adk.server import Server
from kagenti_adk.server.context import RunContext

server = Server()


@server.agent()
async def implement_your_agent_logic_example(input: Message, context: RunContext):
    """Polite agent that greets the user"""
    hello_template: str = os.getenv("HELLO_TEMPLATE", "Ciao %s!")
    yield AgentMessage(text=hello_template % get_message_text(input))


def run():
    server.run(host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", 8000)))


if __name__ == "__main__":
    run()
