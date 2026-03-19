# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0


from __future__ import annotations

import os
import re
from types import NoneType
from typing import TYPE_CHECKING, Any, Self

import pydantic
from a2a.server.agent_execution.context import RequestContext
from a2a.types import Message as A2AMessage
from typing_extensions import override

from kagenti_adk.a2a.extensions.base import BaseExtensionClient, BaseExtensionServer, BaseExtensionSpec
from kagenti_adk.util.pydantic import REVEAL_SECRETS, SecureBaseModel, redact_str

__all__ = [
    "LLMDemand",
    "LLMFulfillment",
    "LLMServiceExtensionClient",
    "LLMServiceExtensionMetadata",
    "LLMServiceExtensionParams",
    "LLMServiceExtensionServer",
    "LLMServiceExtensionSpec",
]

if TYPE_CHECKING:
    from kagenti_adk.server.context import RunContext

__all__ = [
    "LLMDemand",
    "LLMFulfillment",
    "LLMServiceExtensionClient",
    "LLMServiceExtensionMetadata",
    "LLMServiceExtensionParams",
    "LLMServiceExtensionServer",
    "LLMServiceExtensionSpec",
]


class LLMFulfillment(SecureBaseModel):
    identifier: str | None = None
    """
    Name of the model for identification and optimization purposes. Usually corresponds to LiteLLM identifiers.
    Should be the name of the provider slash name of the model as it appears in the API.
    Examples: openai/gpt-4o, watsonx/ibm/granite-13b-chat-v2, ollama/mistral-small:22b
    """

    api_base: str
    """
    Base URL for an OpenAI-compatible API. It should provide at least /v1/chat/completions
    """

    api_key: str
    """
    API key to attach as a `Authorization: Bearer $api_key` header.
    """

    api_model: str
    """
    Model name to use with the /v1/chat/completions API.
    """

    @pydantic.field_serializer("api_key")
    def _redact_api_key(self, v: str, info) -> str:
        return redact_str(v, info)


class LLMDemand(pydantic.BaseModel):
    description: str | None = None
    """
    Short description of how the model will be used, if multiple are requested.
    Intended to be shown in the UI alongside a model picker dropdown.
    """

    suggested: tuple[str, ...] = ()
    """
    Identifiers of models recommended to be used. Usually corresponds to LiteLLM identifiers.
    Should be the name of the provider slash name of the model as it appears in the API.
    Examples: openai/gpt-4o, watsonx/ibm/granite-13b-chat-v2, ollama/mistral-small:22b
    """


class LLMServiceExtensionParams(pydantic.BaseModel):
    llm_demands: dict[str, LLMDemand]
    """Model requests that the agent requires to be provided by the client."""


class LLMServiceExtensionSpec(BaseExtensionSpec[LLMServiceExtensionParams]):
    URI: str = "https://a2a-extensions.adk.kagenti.dev/services/llm/v1"

    @classmethod
    def single_demand(
        cls, name: str | None = None, description: str | None = None, suggested: tuple[str, ...] = ()
    ) -> Self:
        return cls(
            params=LLMServiceExtensionParams(
                llm_demands={name or "default": LLMDemand(description=description, suggested=suggested)}
            )
        )


class LLMServiceExtensionMetadata(pydantic.BaseModel):
    llm_fulfillments: dict[str, LLMFulfillment] = {}
    """Provided models corresponding to the model requests."""


class LLMServiceExtensionServer(BaseExtensionServer[LLMServiceExtensionSpec, LLMServiceExtensionMetadata]):
    @override
    def handle_incoming_message(self, message: A2AMessage, run_context: RunContext, request_context: RequestContext):
        super().handle_incoming_message(message, run_context, request_context)

        if self.data and self.data.llm_fulfillments:
            from kagenti_adk.platform import get_platform_client

            for fulfillment in self.data.llm_fulfillments.values():
                platform_url = str(get_platform_client().base_url).rstrip("/")
                fulfillment.api_base = re.sub("{platform_url}", platform_url, fulfillment.api_base)
        elif not self.data or not self.data.llm_fulfillments:
            fulfillment = _llm_fulfillment_from_env()
            if fulfillment:
                self._metadata_from_client = LLMServiceExtensionMetadata(llm_fulfillments={"default": fulfillment})


class LLMServiceExtensionClient(BaseExtensionClient[LLMServiceExtensionSpec, NoneType]):
    def fulfillment_metadata(self, *, llm_fulfillments: dict[str, LLMFulfillment]) -> dict[str, Any]:
        return {
            self.spec.URI: LLMServiceExtensionMetadata(llm_fulfillments=llm_fulfillments).model_dump(
                mode="json", context={REVEAL_SECRETS: True}
            )
        }


def _llm_fulfillment_from_env() -> LLMFulfillment | None:
    """Build a default LLM fulfillment from environment variables.

    Resolution order: LLM_API_BASE > OPENAI_API_BASE, LLM_API_KEY > OPENAI_API_KEY, LLM_MODEL > OPENAI_MODEL.
    Returns None if the required variables (api_base and api_model) are not set.
    """
    api_base = os.environ.get("LLM_API_BASE") or os.environ.get("OPENAI_API_BASE")
    api_key = os.environ.get("LLM_API_KEY") or os.environ.get("OPENAI_API_KEY") or ""
    api_model = os.environ.get("LLM_MODEL") or os.environ.get("OPENAI_MODEL")

    if not api_base or not api_model:
        return None

    return LLMFulfillment(api_base=api_base, api_key=api_key, api_model=api_model)
