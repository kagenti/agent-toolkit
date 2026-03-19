/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CreateProviderRequest } from '@kagenti/adk';

import type { ProviderSource } from '#modules/providers/types.ts';

export type ImportAgentFormValues = CreateProviderRequest & {
  source: ProviderSource;
  providerId?: string;
};
