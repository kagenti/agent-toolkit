# Copyright 2026 © IBM Corp.
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import os
from unittest.mock import patch

import pytest

from kagenti_adk.a2a.extensions.services.llm import _llm_fulfillment_from_env


@pytest.fixture(autouse=True)
def _clean_env():
    """Ensure no LLM env vars leak between tests."""
    env_vars = ["LLM_API_BASE", "LLM_API_KEY", "LLM_MODEL", "OPENAI_API_BASE", "OPENAI_API_KEY", "OPENAI_MODEL"]
    with patch.dict(os.environ, {}, clear=False):
        for var in env_vars:
            os.environ.pop(var, None)
        yield


class TestLlmFulfillmentFromEnv:
    def test_returns_none_when_no_env_vars(self):
        assert _llm_fulfillment_from_env() is None

    def test_returns_none_when_only_api_base(self):
        os.environ["LLM_API_BASE"] = "http://localhost:8080"
        assert _llm_fulfillment_from_env() is None

    def test_returns_none_when_only_model(self):
        os.environ["LLM_MODEL"] = "gpt-4o"
        assert _llm_fulfillment_from_env() is None

    def test_primary_env_vars(self):
        os.environ["LLM_API_BASE"] = "http://localhost:8080"
        os.environ["LLM_API_KEY"] = "sk-primary"
        os.environ["LLM_MODEL"] = "gpt-4o"

        result = _llm_fulfillment_from_env()
        assert result is not None
        assert result.api_base == "http://localhost:8080"
        assert result.api_key == "sk-primary"
        assert result.api_model == "gpt-4o"

    def test_openai_fallback_env_vars(self):
        os.environ["OPENAI_API_BASE"] = "https://api.openai.com/v1"
        os.environ["OPENAI_API_KEY"] = "sk-openai"
        os.environ["OPENAI_MODEL"] = "gpt-4o-mini"

        result = _llm_fulfillment_from_env()
        assert result is not None
        assert result.api_base == "https://api.openai.com/v1"
        assert result.api_key == "sk-openai"
        assert result.api_model == "gpt-4o-mini"

    def test_primary_takes_precedence_over_openai(self):
        os.environ["LLM_API_BASE"] = "http://primary"
        os.environ["OPENAI_API_BASE"] = "http://openai"
        os.environ["LLM_MODEL"] = "primary-model"
        os.environ["OPENAI_MODEL"] = "openai-model"

        result = _llm_fulfillment_from_env()
        assert result is not None
        assert result.api_base == "http://primary"
        assert result.api_model == "primary-model"

    def test_api_key_defaults_to_empty_string(self):
        os.environ["LLM_API_BASE"] = "http://localhost:8080"
        os.environ["LLM_MODEL"] = "local-model"

        result = _llm_fulfillment_from_env()
        assert result is not None
        assert result.api_key == ""

    def test_mixed_primary_and_openai(self):
        os.environ["LLM_API_BASE"] = "http://primary"
        os.environ["OPENAI_API_KEY"] = "sk-openai"
        os.environ["LLM_MODEL"] = "primary-model"

        result = _llm_fulfillment_from_env()
        assert result is not None
        assert result.api_base == "http://primary"
        assert result.api_key == "sk-openai"
        assert result.api_model == "primary-model"
