/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ListProvidersRequest } from '@kagenti/adk';
import { useQuery } from '@tanstack/react-query';

import { listProviders } from '..';
import { providerKeys } from '../keys';

interface Props extends ListProvidersRequest {
  enabled?: boolean;
}

export function useListProviders({ enabled = true, ...request }: Props = {}) {
  const query = useQuery({
    queryKey: providerKeys.list(request),
    queryFn: () => listProviders(request),
    enabled,
  });

  return query;
}
