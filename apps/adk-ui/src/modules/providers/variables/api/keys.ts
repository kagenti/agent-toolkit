/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ListProviderVariablesRequest } from '@kagenti/adk';

export const providerVariableKeys = {
  all: () => ['providers', 'variables'] as const,
  lists: () => [...providerVariableKeys.all(), 'list'] as const,
  list: ({ id }: ListProviderVariablesRequest) => [...providerVariableKeys.lists(), id],
};
