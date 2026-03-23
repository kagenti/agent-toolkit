/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type z from 'zod';

import type { llmDemandSchema, llmDemandsSchema, llmFulfillmentSchema, llmFulfillmentsSchema } from './schemas';

export type LLMDemand = z.infer<typeof llmDemandSchema>;
export type LLMDemands = z.infer<typeof llmDemandsSchema>;

export type LLMFulfillment = z.infer<typeof llmFulfillmentSchema>;
export type LLMFulfillments = z.infer<typeof llmFulfillmentsSchema>;
