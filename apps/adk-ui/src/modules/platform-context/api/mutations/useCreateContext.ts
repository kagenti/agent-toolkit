/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation } from '@tanstack/react-query';
import type { Context } from '@kagenti/adk';

import { createContext } from '..';
import { contextKeys } from '../keys';

interface Props {
  onSuccess?: (data: Context) => void;
}

export function useCreateContext({ onSuccess }: Props = {}) {
  const mutation = useMutation({
    mutationFn: createContext,
    onSuccess,
    meta: {
      invalidates: [contextKeys.lists()],
    },
  });

  return mutation;
}
