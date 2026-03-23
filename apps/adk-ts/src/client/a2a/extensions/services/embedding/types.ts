/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type z from 'zod';

import type {
  embeddingDemandSchema,
  embeddingDemandsSchema,
  embeddingFulfillmentSchema,
  embeddingFulfillmentsSchema,
} from './schemas';

export type EmbeddingDemand = z.infer<typeof embeddingDemandSchema>;
export type EmbeddingDemands = z.infer<typeof embeddingDemandsSchema>;

export type EmbeddingFulfillment = z.infer<typeof embeddingFulfillmentSchema>;
export type EmbeddingFulfillments = z.infer<typeof embeddingFulfillmentsSchema>;
