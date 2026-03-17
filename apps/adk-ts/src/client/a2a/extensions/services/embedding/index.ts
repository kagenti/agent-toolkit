/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { A2AServiceExtension } from '../../../../core/extensions/types';
import { embeddingDemandsSchema, embeddingFulfillmentsSchema } from './schemas';
import type { EmbeddingDemands, EmbeddingFulfillments } from './types';

export const EMBEDDING_EXTENSION_URI = 'https://a2a-extensions.adk.kagenti.dev/services/embedding/v1';

export const embeddingExtension: A2AServiceExtension<
  typeof EMBEDDING_EXTENSION_URI,
  EmbeddingDemands,
  EmbeddingFulfillments
> = {
  getUri: () => EMBEDDING_EXTENSION_URI,
  getDemandsSchema: () => embeddingDemandsSchema,
  getFulfillmentsSchema: () => embeddingFulfillmentsSchema,
};
