/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { LLMDemand, LLMFulfillment, LLMFulfillments } from '../../../../../extensions';

export interface LLMExtensionParams {
  demands: Record<string, LLMDemand>;
}

export type LLMExtensionFulfillments = LLMFulfillments;

export interface LLMExtensionDeps {
  fulfillments?: Record<string, LLMFulfillment>;
}
