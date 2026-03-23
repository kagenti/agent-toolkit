/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

export const toolKeys = {
  all: () => ['tools'] as const,
  lists: () => [...toolKeys.all(), 'list'] as const,
  list: () => [...toolKeys.lists()] as const,
};
