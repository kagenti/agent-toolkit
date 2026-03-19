/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ListProvidersRequest, ReadProviderRequest } from '@kagenti/adk';

export const providerKeys = {
  all: () => ['providers'] as const,
  lists: () => [...providerKeys.all(), 'list'] as const,
  list: ({ query = {} }: ListProvidersRequest = {}) => [...providerKeys.lists(), query] as const,
  details: () => [...providerKeys.all(), 'detail'] as const,
  detail: ({ id }: ReadProviderRequest) => [...providerKeys.details(), id] as const,
};
