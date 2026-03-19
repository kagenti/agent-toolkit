/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQuery } from '@tanstack/react-query';

import { listVariables } from '..';
import { variableKeys } from '../keys';

export function useListVariables() {
  return useQuery({
    queryKey: variableKeys.lists(),
    queryFn: listVariables,
  });
}
