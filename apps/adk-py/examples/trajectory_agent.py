# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import asyncio
import os
from typing import Annotated

from a2a.types import Message

from kagenti_adk.a2a.extensions import TrajectoryExtensionServer, TrajectoryExtensionSpec
from kagenti_adk.a2a.types import AgentMessage
from kagenti_adk.server import Server
from kagenti_adk.server.context import RunContext

server = Server()


@server.agent(
    name="Trajectories example agent",
)
async def example_agent(
    input: Message,
    context: RunContext,
    trajectory: Annotated[TrajectoryExtensionServer, TrajectoryExtensionSpec()],
):
    """Agent that demonstrates conversation history access"""

    metadata = trajectory.trajectory_metadata(
        title="Initializing...",
        content="Initializing...",
    )
    yield metadata

    await asyncio.sleep(2.5)

    for i in range(1, 4):
        metadata = trajectory.trajectory_metadata(
            title=f"Doing step {i}/6",
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        )
        yield metadata
        await asyncio.sleep(0.3)

    for i in range(4, 7):
        metadata = trajectory.trajectory_metadata(
            title=f"Doing step {i}/6 - and a very long title to test UI wrapping capabilities, maybe a little longer",
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        )
        yield metadata
        await asyncio.sleep(0.8)

    await asyncio.sleep(1)

    metadata = trajectory.trajectory_metadata(
        title="Step with long content",
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    )
    yield metadata
    await asyncio.sleep(2)

    metadata = trajectory.trajectory_metadata(
        title="Test Markdown rendering",
        content="""
# 🧭 Trajectory Markdown Rendering Test

This document tests **Markdown rendering** capabilities within the trajectory feature.

---

## 🧩 Section 1: Headers and Text Formatting

### Header Level 3

You should see **bold**, *italic*, and ***bold italic*** text properly rendered.
> This is a blockquote — it should appear indented and stylized.

Need Markdown basics? Check out [Markdown Guide](https://www.markdownguide.org/basic-syntax/).

---

## 🧾 Section 2: Lists

### Unordered List
- Apple 🍎 — [Learn more about apples](https://en.wikipedia.org/wiki/Apple)
- Banana 🍌 — [Banana facts](https://en.wikipedia.org/wiki/Banana)
- Cherry 🍒

### Ordered List
1. First item
2. Second item
3. Third item

### Nested List
- Outer item
  - Inner item
    - Deep inner item

---

## 📊 Section 3: Tables

| Entity Type | Example Value     | Confidence | Reference |
|--------------|------------------|-------------|------------|
| **Name**     | Alice Johnson     | 0.97        | [Details](https://example.com) |
| **Date**     | 2025-11-12        | 0.88        | [Details](https://example.com) |
| **Location** | San Francisco, CA | 0.91        | [Details](https://example.com) |

---

## 💻 Section 4: Code Blocks

### Inline Code
You can include inline code like `const result = extractEntities(text);`.

### Fenced Code Block
```python
def extract_entities(text):
    entities = {
        "name": "Alice Johnson",
        "date": "2025-11-12",
        "location": "San Francisco"
    }
    return entities
""",
    )
    yield metadata

    await asyncio.sleep(2)

    metadata = trajectory.trajectory_metadata(
        title="Test JSON rendering",
        content="""{
  "status": "success",
  "data": {
    "results": [
      {
        "id": 1,
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "role": "developer",
        "active": true
      },
      {
        "id": 2,
        "name": "Bob Smith",
        "email": "bob@example.com",
        "role": "designer",
        "active": false
      }
    ],
    "metadata": {
      "total": 2,
      "page": 1,
      "limit": 10
    }
  },
  "timestamp": "2025-11-12T14:30:00Z"
}""",
    )
    yield metadata

    await asyncio.sleep(1)

    metadata = trajectory.trajectory_metadata(
        title="Web search", content="Querying search engines...", group_id="websearch"
    )
    yield metadata

    await asyncio.sleep(4)

    metadata = trajectory.trajectory_metadata(content="Found 8 results.", group_id="websearch")
    yield metadata

    await asyncio.sleep(1)

    metadata = trajectory.trajectory_metadata(content="Found 8 results\nAnalyzed 3/8 results", group_id="websearch")
    yield metadata

    await asyncio.sleep(2)

    metadata = trajectory.trajectory_metadata(content="Found 8 results\nAnalyzed 8/8 results", group_id="websearch")
    yield metadata

    await asyncio.sleep(4)

    metadata = trajectory.trajectory_metadata(
        title="Web search finished",
        content="Found 8 results\nAnalyzed 8/8 results\nExtracted key information from 8 sources",
        group_id="websearch",
    )
    yield metadata

    # Your agent logic here - you can now reference all messages in the conversation
    message = AgentMessage(
        text="Hello! Look at the trajectories grouped in the UI! You should also find them in session history."
    )
    yield message


def run():
    server.run(
        host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", 8000))
    )


if __name__ == "__main__":
    run()
