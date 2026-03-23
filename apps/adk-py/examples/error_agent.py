# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import os
from typing import Annotated

from a2a.types import Message

from kagenti_adk.a2a.extensions import (
    ErrorExtensionParams,
    ErrorExtensionServer,
    ErrorExtensionSpec,
)
from kagenti_adk.server import Server

server = Server()


@server.agent()
async def error_agent(
    input: Message,
    error_ext: Annotated[
        ErrorExtensionServer,
        ErrorExtensionSpec(params=ErrorExtensionParams(include_stacktrace=True)),
    ],
):
    """Agent that demonstrates error handling using the ErrorExtension."""
    yield "I am about to fail..."

    # Intentionally raise an error to demonstrate the extension
    # The server wrapper will catch this and use the injected error_ext to format the message
    raise ValueError("This is a simulated error to demonstrate the ErrorExtension.")


def run():
    server.run(host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", 10000)))


if __name__ == "__main__":
    run()
