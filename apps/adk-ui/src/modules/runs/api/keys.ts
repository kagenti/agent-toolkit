/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

export const runKeys = {
  all: () => ['run'] as const,
  clients: () => [...runKeys.all(), 'client'] as const,
  client: (id: string) => [...runKeys.clients(), id] as const,
};
