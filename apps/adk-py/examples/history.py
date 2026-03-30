# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import os

from a2a.types import Message
from a2a.utils.message import get_message_text

from kagenti_adk.a2a.types import AgentMessage
from kagenti_adk.server import Server
from kagenti_adk.server.context import RunContext

server = Server()


@server.agent()
async def example_agent(input: Message, context: RunContext):
    """Agent that demonstrates conversation history access"""

    # Get the current user message
    current_message = get_message_text(input)
    print(f"Current message: {current_message}")

    # Load all messages from conversation history (including current message)
    history = [message async for message in context.load_history() if isinstance(message, Message) and message.parts]

    # Process the conversation history
    print(f"Found {len(history)} messages in conversation (including current)")

    # Your agent logic here - you can now reference all messages in the conversation
    message = AgentMessage(text=f"Hello! I can see we have {len(history)} messages in our conversation.")
    yield message


def run():
    server.run(host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", 8000)))


if __name__ == "__main__":
    run()
