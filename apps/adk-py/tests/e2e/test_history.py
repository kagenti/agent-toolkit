# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from collections.abc import AsyncGenerator, AsyncIterator

import pytest
from a2a.client import Client, ClientEvent, create_text_message_object
from a2a.types import (
    Artifact,
    Message,
    SendMessageRequest,
    Task,
)

from kagenti_adk.a2a.types import AgentMessage, RunYield
from kagenti_adk.server import Server
from kagenti_adk.server.context import RunContext

pytestmark = pytest.mark.e2e


async def get_final_task_from_stream(stream: AsyncIterator[ClientEvent | Message]) -> Task | None:
    final_task = None
    async for event in stream:
        match event:
            case (_, task):
                final_task = task
    return final_task


async def send_message_get_response(
    client: Client, content: str, context_id: str | None = None
) -> tuple[list[str], str]:
    message = create_text_message_object(content=content)
    if context_id is not None:
        message.context_id = context_id
    final_task = await get_final_task_from_stream(client.send_message(SendMessageRequest(message=message)))

    agent_messages = [msg.parts[0].text for msg in final_task.history or []]
    return agent_messages, final_task.context_id


@pytest.fixture
async def history_reader_agent(create_server_with_agent) -> AsyncGenerator[tuple[Server, Client]]:
    """Agent that reads history from the task store via RunContext.load_history()."""

    async def history_reader(input: Message, context: RunContext) -> AsyncGenerator[RunYield, None]:
        # Load history from the task store (will contain messages from previous interactions in same task)
        history_items: list[str] = []
        async for item in context.load_history():
            if isinstance(item, Message) and item.parts:
                history_items.append(item.parts[0].text)
            elif isinstance(item, Artifact) and item.parts:
                history_items.append(f"artifact:{item.parts[0].text}")

        # Echo back what we found in history plus the current input
        if history_items:
            yield AgentMessage(text=f"history={','.join(history_items)}")
        yield AgentMessage(text=f"input={input.parts[0].text}")

    async with create_server_with_agent(history_reader) as (server, client):
        yield server, client


async def test_load_history_from_task_store(history_reader_agent):
    """Test that RunContext.load_history() reads from the A2A task store."""
    _, client = history_reader_agent

    # First message — no history yet
    agent_messages, context_id = await send_message_get_response(client, "hello")
    assert any("input=hello" in msg for msg in agent_messages)
