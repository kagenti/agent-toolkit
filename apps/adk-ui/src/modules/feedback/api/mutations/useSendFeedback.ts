/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation } from '@tanstack/react-query';

import { sendFeedback } from '..';

export function useSendFeedback() {
  const mutation = useMutation({
    mutationFn: sendFeedback,
    meta: {
      errorToast: {
        title: 'Failed to send feedback.',
        includeErrorMessage: true,
      },
    },
  });

  return mutation;
}
