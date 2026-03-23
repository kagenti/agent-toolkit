/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation } from '@tanstack/react-query';

import { createConnector } from '..';
import { connectorKeys } from '../keys';
import type { Connector } from '../types';

interface Props {
  onSuccess?: (connector: Connector) => void;
}

export function useCreateConnector({ onSuccess }: Props = {}) {
  const mutation = useMutation({
    mutationFn: createConnector,
    onSuccess,
    meta: {
      invalidates: [connectorKeys.list()],
      errorToast: {
        title: 'Failed to create connector.',
        includeErrorMessage: true,
      },
    },
  });

  return mutation;
}
