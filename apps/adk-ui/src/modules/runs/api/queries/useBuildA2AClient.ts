/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { TaskStatusUpdateEvent } from '@kagenti/adk';
import { useQuery } from '@tanstack/react-query';

import { buildA2AClient } from '#api/a2a/client.ts';

import { runKeys } from '../keys';

type Props<UIGenericPart> = {
  providerId?: string;
  authToken?: string;
  onStatusUpdate?: (event: TaskStatusUpdateEvent) => UIGenericPart[];
};

export function useBuildA2AClient<UIGenericPart = never>({
  providerId = '',
  authToken = '',
  onStatusUpdate,
}: Props<UIGenericPart>) {
  const { data: agentClient } = useQuery({
    queryKey: runKeys.client(providerId),
    queryFn: async () =>
      buildA2AClient<UIGenericPart>({
        providerId,
        authToken,
        onStatusUpdate,
      }),
    enabled: Boolean(providerId && authToken),
    staleTime: Infinity,
  });

  return { agentClient };
}
