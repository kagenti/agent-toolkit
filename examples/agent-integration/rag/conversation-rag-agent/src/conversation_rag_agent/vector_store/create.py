# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from kagenti_adk.platform import VectorStore
from openai import AsyncOpenAI


async def create_vector_store(embedding_client: AsyncOpenAI, embedding_model: str):
    embedding_response = await embedding_client.embeddings.create(input="test", model=embedding_model)
    dimension = len(embedding_response.data[0].embedding)
    return await VectorStore.create(
        name="rag-example",
        dimension=dimension,
        model_id=embedding_model,
    )
