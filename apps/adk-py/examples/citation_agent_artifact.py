# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import os
from typing import Annotated

from a2a.types import Message, TextPart

from kagenti_adk.a2a.extensions import Citation, CitationExtensionServer, CitationExtensionSpec
from kagenti_adk.a2a.types import AgentArtifact
from kagenti_adk.server import Server
from kagenti_adk.server.context import RunContext

server = Server()


@server.agent(
    name="Citations example agent",
)
async def example_agent(
    input: Message,
    context: RunContext,
    citation: Annotated[CitationExtensionServer, CitationExtensionSpec()],
):
    """Agent that demonstrates citation extension usage"""

    # Simulate researching multiple sources
    research_text = """Based on recent research, artificial intelligence has made significant progress in natural
language processing. Studies show that transformer models have revolutionized the field, and
recent developments in large language models demonstrate remarkable capabilities in understanding
and generating human-like text."""

    # Create citations for the sources
    citations = [
        Citation(
            url="https://arxiv.org/abs/1706.03762",
            title="Attention Is All You Need",
            description="transformer models",
            start_index=research_text.index("transformer models"),
            end_index=research_text.index("transformer models") + len("transformer models"),
        ),
        Citation(
            url="https://openai.com/research/gpt-4",
            title="GPT-4 Technical Report",
            description="large language models",
            start_index=research_text.index("large language models"),
            end_index=research_text.index("large language models") + len("large language models"),
        ),
    ]

    # Send artifact with citation metadata
    artifact = AgentArtifact(
        name="Research Findings",
        parts=[TextPart(text=research_text)],
        metadata=citation.citation_metadata(citations=citations),
    )
    yield artifact


def run():
    server.run(
        host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", 8002))
    )


if __name__ == "__main__":
    run()
