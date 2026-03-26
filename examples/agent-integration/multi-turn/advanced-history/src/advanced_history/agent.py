# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

import os
from typing import Annotated

from a2a.types import Message, Role
from a2a.utils.message import get_message_text
from kagenti_adk.a2a.extensions import LLMServiceExtensionServer, LLMServiceExtensionSpec
from kagenti_adk.a2a.types import AgentMessage
from kagenti_adk.server import Server
from kagenti_adk.server.context import RunContext
from beeai_framework.adapters.agentstack.backend.chat import AgentStackChatModel
from beeai_framework.agents.requirement import RequirementAgent
from beeai_framework.agents.requirement.requirements.conditional import ConditionalRequirement
from beeai_framework.backend import AssistantMessage, UserMessage
from beeai_framework.tools.think import ThinkTool

server = Server()

FrameworkMessage = UserMessage | AssistantMessage


def to_framework_message(message: Message) -> FrameworkMessage:
    """Convert A2A Message to Kagenti ADK Message format"""
    message_text = "".join(part.text for part in message.parts if part.text)

    if message.role == Role.ROLE_AGENT:
        return AssistantMessage(message_text)
    elif message.role == Role.ROLE_USER:
        return UserMessage(message_text)
    else:
        raise ValueError(f"Invalid message role: {message.role}")


@server.agent()
async def advanced_history_example(
    input: Message,
    context: RunContext,
    llm: Annotated[LLMServiceExtensionServer, LLMServiceExtensionSpec.single_demand()],
):
    """Multi-turn chat agent with conversation memory and LLM integration"""
    # Load conversation history
    history = [message async for message in context.load_history() if isinstance(message, Message) and message.parts]

    # Initialize Kagenti ADK LLM client
    llm_client = AgentStackChatModel(tool_choice_support={"none", "auto"})
    llm_client.set_context(llm)

    # Create a RequirementAgent with conversation memory
    agent = RequirementAgent(
        name="Agent",
        llm=llm_client,
        role="helpful assistant",
        instructions="You are a helpful assistant that is supposed to remember users name. Ask them for their name and remember it.",
        tools=[ThinkTool()],
        requirements=[ConditionalRequirement(ThinkTool, force_at_step=1)],
        save_intermediate_steps=False,
        middlewares=[],
    )

    # Load conversation history into agent memory
    await agent.memory.add_many(to_framework_message(item) for item in history)

    # Process the current message and generate response
    async for event, meta in agent.run(get_message_text(input)):
        if meta.name == "success" and event.state.steps:
            step = event.state.steps[-1]
            if not step.tool:
                continue

            tool_name = step.tool.name

            if tool_name == "final_answer":
                response = AgentMessage(text=step.input["response"])

                yield response


def run():
    server.run(
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", "8000")),
    )


if __name__ == "__main__":
    run()
