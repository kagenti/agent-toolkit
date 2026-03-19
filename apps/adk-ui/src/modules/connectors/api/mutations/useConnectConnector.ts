/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation } from '@tanstack/react-query';

import { connectConnector } from '..';
import { connectorKeys } from '../keys';

export function useConnectConnector() {
  const mutation = useMutation({
    mutationFn: connectConnector,
    meta: {
      invalidates: [connectorKeys.list()],
      errorToast: {
        title: 'Failed to connect service.',
        includeErrorMessage: true,
      },
    },
  });

  return mutation;
}
