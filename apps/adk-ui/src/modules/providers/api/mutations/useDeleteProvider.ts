/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ListProvidersResponse } from '@kagenti/adk';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { providerKeys } from '#modules/providers/api/keys.ts';

import { deleteProvider } from '..';

export function useDeleteProvider() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteProvider,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<ListProvidersResponse>(providerKeys.lists(), (data) => {
        if (!data) {
          return data;
        }

        const items = data?.items.filter(({ id }) => id !== variables.id) ?? [];

        return { ...data, items };
      });
    },
    meta: {
      invalidates: [providerKeys.lists()],
      errorToast: {
        title: 'Failed to delete provider.',
        includeErrorMessage: true,
      },
    },
  });

  return mutation;
}
