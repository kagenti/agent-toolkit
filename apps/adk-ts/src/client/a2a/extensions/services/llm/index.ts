/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { A2AServiceExtension } from '../../../../core/extensions/types';
import { llmDemandsSchema, llmFulfillmentsSchema } from './schemas';
import type { LLMDemands, LLMFulfillments } from './types';

export const LLM_EXTENSION_URI = 'https://a2a-extensions.adk.kagenti.dev/services/llm/v1';

export const llmExtension: A2AServiceExtension<typeof LLM_EXTENSION_URI, LLMDemands, LLMFulfillments> = {
  getUri: () => LLM_EXTENSION_URI,
  getDemandsSchema: () => llmDemandsSchema,
  getFulfillmentsSchema: () => llmFulfillmentsSchema,
};
