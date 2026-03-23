# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0


from __future__ import annotations

from collections.abc import AsyncIterator
from typing import Protocol

import openai.types.chat

from adk_server.api.schema.openai import ChatCompletionRequest, EmbeddingsRequest
from adk_server.domain.models.model_provider import Model, ModelProvider


class IOpenAIChatCompletionProxyAdapter(Protocol):
    async def list_models(self, *, api_key: str) -> list[Model]: ...

    async def create_chat_completion(
        self,
        *,
        request: ChatCompletionRequest,
        api_key: str,
    ) -> openai.types.chat.ChatCompletion: ...

    def create_chat_completion_stream(
        self,
        *,
        request: ChatCompletionRequest,
        api_key: str,
    ) -> AsyncIterator[openai.types.chat.ChatCompletionChunk]: ...


class IOpenAIEmbeddingProxyAdapter(Protocol):
    async def list_models(self, *, api_key: str) -> list[Model]: ...

    async def create_embedding(
        self,
        *,
        request: EmbeddingsRequest,
        api_key: str,
    ) -> openai.types.CreateEmbeddingResponse: ...


class IOpenAIProxy(Protocol):
    async def list_models(self, *, provider: ModelProvider, api_key: str) -> list[Model]: ...
    def get_chat_completion_proxy(self, *, provider: ModelProvider) -> IOpenAIChatCompletionProxyAdapter: ...
    def get_embedding_proxy(self, *, provider: ModelProvider) -> IOpenAIEmbeddingProxyAdapter: ...
