/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Provider } from '@kagenti/adk';
import { ProviderState } from '@kagenti/adk';

import { useProvider } from '#modules/providers/api/queries/useProvider.ts';

interface Props {
  providerId: string | null | undefined;
}

function getStatusHelpers(data?: Provider) {
  const status = data?.state;
  const isNotInstalled = false;
  const isStarting = false;
  const isError = status === ProviderState.Offline;
  const isReady = status === ProviderState.Online;

  return {
    status,
    isNotInstalled,
    isStarting,
    isError,
    isReady,
  };
}

export function useProviderStatus({ providerId }: Props) {
  const query = useProvider({ id: providerId ?? undefined });

  return {
    refetch: async () => {
      const { data } = await query.refetch();

      return getStatusHelpers(data);
    },
    ...getStatusHelpers(query.data),
  };
}

export type ProviderStatusWithHelpers = ReturnType<typeof getStatusHelpers>;
