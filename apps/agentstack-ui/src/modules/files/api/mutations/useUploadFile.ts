/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMutation } from '@tanstack/react-query';
import type { CreateFileResponse } from '@kagenti/adk';

import { uploadFile } from '..';
import type { UploadFileParams } from '../types';

interface Props {
  onMutate?: (variables: UploadFileParams) => void;
  onSuccess?: (data: CreateFileResponse, variables: UploadFileParams) => void;
  onError?: (error: Error, variables: UploadFileParams) => void;
}

export function useUploadFile({ onMutate, onSuccess, onError }: Props = {}) {
  const mutation = useMutation({
    mutationFn: uploadFile,
    onMutate,
    onSuccess,
    onError,
    meta: {
      errorToast: {
        title: 'Failed to upload file.',
        includeErrorMessage: true,
      },
    },
  });

  return mutation;
}
