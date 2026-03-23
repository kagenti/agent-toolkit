/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

export const variableKeys = {
  all: () => ['variables'] as const,
  lists: () => [...variableKeys.all(), 'list'] as const,
};
