/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ListContextHistoryRequest, ListContextsRequest } from '@kagenti/adk';

export const contextKeys = {
  all: () => ['contexts'] as const,
  lists: () => [...contextKeys.all(), 'list'] as const,
  list: ({ query = {} }: ListContextsRequest) => [...contextKeys.lists(), query] as const,
  histories: () => [...contextKeys.all(), 'history'] as const,
  history: ({ context_id, query = {} }: ListContextHistoryRequest) =>
    [...contextKeys.histories(), context_id, query] as const,
  tokens: () => [...contextKeys.all(), 'token'] as const,
  token: (contextId: string, providerId: string) => [...contextKeys.tokens(), contextId, providerId] as const,
};
