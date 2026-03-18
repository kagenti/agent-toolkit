# Copyright 2025 © BeeAI a Series of LF Projects, LLC
# SPDX-License-Identifier: Apache-2.0

import asyncio

from kagenti_adk.platform import File


async def extract_file(file: File):
    extraction = await file.create_extraction()
    while extraction.status in {"pending", "in_progress"}:
        await asyncio.sleep(1)
        extraction = await file.get_extraction()
    if extraction.status != "completed":
        raise ValueError(f"Extraction failed with status: {extraction.status}")
