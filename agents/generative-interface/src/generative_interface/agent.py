# Copyright 2025 © BeeAI a Series of LF Projects, LLC
# SPDX-License-Identifier: Apache-2.0

import os
from typing import Annotated

import a2a.types
import agentstack_sdk.a2a.extensions
from a2a.types import Message
from agentstack_sdk.a2a.extensions.services.generative_interface import (
    ComponentNode,
    GenerativeInterfaceExtensionServer,
    GenerativeInterfaceExtensionSpec,
    GenerativeInterfaceSpec,
)
from agentstack_sdk.server import Server
from agentstack_sdk.server.middleware.platform_auth_backend import PlatformAuthBackend

agent_detail_extension_spec = agentstack_sdk.a2a.extensions.AgentDetailExtensionSpec(
    params=agentstack_sdk.a2a.extensions.AgentDetail(
        interaction_mode="multi-turn",
    )
)



server = Server()


@server.agent(
    name="Generative Interface Agent",
    documentation_url=f"https://github.com/i-am-bee/agentstack/blob/{os.getenv('RELEASE_VERSION', 'main')}/agents/generative-interface",
    version="1.0.0",
    default_input_modes=["text", "text/plain"],
    default_output_modes=["text", "text/plain"],
    capabilities=a2a.types.AgentCapabilities(
        streaming=True,
        push_notifications=False,
        state_transition_history=False,
        extensions=[
            *agent_detail_extension_spec.to_agent_card_extensions(),
        ],
    ),
    skills=[
        a2a.types.AgentSkill(
            id="generative-interface",
            name="Generative Interface",
            description="Demonstrates dynamic UI rendering with generative interface",
            tags=["generative-interface"],
        )
    ],
)
async def agent(
    _message: Message,
    ui: Annotated[
        GenerativeInterfaceExtensionServer,
        GenerativeInterfaceExtensionSpec.demand()
    ],
):
    """Example demonstrating an agent using generative interface to render dynamic UI."""

    print(ui.catalog_prompt)

    yield "Here's a button for you to click:"

    spec = GenerativeInterfaceSpec(
        root=ComponentNode(
            type="Button",
            props={"id": "action-button", "label": "Click me!", "kind": "primary"},
        )
    )

    response = await ui.request_ui(spec=spec)

    if response:
        yield f"You clicked: {response.component_id} (event: {response.event_type})"
    else:
        yield "No interaction received."


def serve():
    try:
        server.run(
            host=os.getenv("HOST", "127.0.0.1"),
            port=int(os.getenv("PORT", 10001)),
            configure_telemetry=True,
            auth_backend=PlatformAuthBackend(),
        )
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    serve()
