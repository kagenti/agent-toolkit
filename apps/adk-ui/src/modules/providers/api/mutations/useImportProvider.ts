/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation } from '@tanstack/react-query';

import { createProvider } from '..';
import { providerKeys } from '../keys';

export function useImportProvider() {
  const mutation = useMutation({
    mutationFn: createProvider,
    meta: {
      invalidates: [providerKeys.lists()],
      errorToast: {
        title: 'Failed to import provider.',
        includeErrorMessage: true,
      },
    },
  });

  return mutation;
}
