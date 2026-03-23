/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQuery } from '@tanstack/react-query';

import { readProvider } from '..';
import { providerKeys } from '../keys';

interface Props {
  id?: string;
}

export function useProvider({ id = '' }: Props) {
  const query = useQuery({
    queryKey: providerKeys.detail({ id }),
    queryFn: () => readProvider({ id }),
    enabled: Boolean(id),
  });

  return query;
}
