/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ListContextsRequest } from '@kagenti/adk';

export const contextKeys = {
  all: () => ['contexts'] as const,
  lists: () => [...contextKeys.all(), 'list'] as const,
  list: ({ query = {} }: ListContextsRequest) => [...contextKeys.lists(), query] as const,
  tokens: () => [...contextKeys.all(), 'token'] as const,
  token: (contextId: string, providerId: string) => [...contextKeys.tokens(), contextId, providerId] as const,
};
