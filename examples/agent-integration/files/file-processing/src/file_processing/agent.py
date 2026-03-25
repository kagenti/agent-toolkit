# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

import os
from typing import Annotated

from a2a.types import Message, Part
from kagenti_adk.a2a.extensions import PlatformApiExtensionServer, PlatformApiExtensionSpec
from kagenti_adk.platform import File
from kagenti_adk.server import Server
from kagenti_adk.util.file import load_file

server = Server()


@server.agent(
    default_input_modes=["text/plain", "application/pdf", "image/*"],
    default_output_modes=["text/plain", "application/pdf", "image/*"],
)
async def file_processing_example(
    input: Message,
    _: Annotated[PlatformApiExtensionServer, PlatformApiExtensionSpec()],
):
    """Agent that handles both text and binary files"""

    for part in input.parts:
        if part.url or part.HasField("raw"):
            mime_type = part.media_type or "application/octet-stream"

            async with load_file(part) as loaded_content:
                # Determine if file is text or binary based on MIME type
                is_text_file = mime_type.startswith("text/") or mime_type in [
                    "application/json",
                    "application/xml",
                    "text/xml",
                ]

                if is_text_file:
                    # For text files, use .text and encode to bytes
                    content = loaded_content.text.encode()
                else:
                    # For binary files (PDFs, images, etc.), use .content directly
                    content = loaded_content.content

                # Create new file with appropriate content
                new_file = await File.create(
                    filename=f"processed_{part.filename or 'file'}",
                    content_type=mime_type,
                    content=content,
                )
                yield new_file.to_part()

    yield "File processing complete"


def run():
    server.run(host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", 8000)))


if __name__ == "__main__":
    run()
