/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation } from '@tanstack/react-query';

import { providerKeys } from '#modules/providers/api/keys.ts';

import { updateProviderVariables } from '..';
import { providerVariableKeys } from '../keys';

interface Props {
  onSuccess?: () => void;
}

export function useUpdateProviderVariables({ onSuccess }: Props = {}) {
  const mutation = useMutation({
    mutationFn: updateProviderVariables,
    onSuccess,
    meta: {
      invalidates: [providerVariableKeys.lists(), providerKeys.lists()],
      errorToast: {
        title: 'Failed to update variable.',
        includeErrorMessage: true,
      },
    },
  });

  return mutation;
}
