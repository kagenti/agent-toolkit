# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import os
from typing import Annotated

from a2a.types import Message

from kagenti_adk.a2a.extensions import (
    AgentDetail,
    AgentDetailContributor,
    SecretDemand,
    SecretsExtensionServer,
    SecretsExtensionSpec,
    SecretsServiceExtensionParams,
)
from kagenti_adk.server import Server

server = Server()


@server.agent(
    name="Agent with secrets",
    detail=AgentDetail(
        interaction_mode="multi-turn",
        author=AgentDetailContributor(name="BeeAI contributors"),
        contributors=[AgentDetailContributor(name="John"), AgentDetailContributor(name="Kate")],
        license="Apache 2.0",
    ),
)
async def secrets_agent(
    input: Message,
    secrets: Annotated[
        SecretsExtensionServer,
        SecretsExtensionSpec(
            params=SecretsServiceExtensionParams(
                secret_demands={"ibm_cloud": SecretDemand(description="IBM Cloud API key", name="IBM Cloud")}
            )
        ),
    ],
):
    """Agent that uses request a secret that can be provided during runtime"""
    if secrets and secrets.data and secrets.data.secret_fulfillments:
        yield f"IBM Cloud API key: {secrets.data.secret_fulfillments['ibm_cloud'].secret.get_secret_value()}"
    else:
        runtime_provided_secrets = await secrets.request_secrets(
            params=SecretsServiceExtensionParams(
                secret_demands={"ibm_cloud": SecretDemand(description="I really need IBM Cloud Key", name="IBM Cloud")}
            )
        )
        if runtime_provided_secrets and runtime_provided_secrets.secret_fulfillments:
            yield f"IBM Cloud API key: {runtime_provided_secrets.secret_fulfillments['ibm_cloud'].secret.get_secret_value()}"
        else:
            yield "No IBM Cloud API key provided"


def run():
    server.run(host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", 8000)))


if __name__ == "__main__":
    run()
