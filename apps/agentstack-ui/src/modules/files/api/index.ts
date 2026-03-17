/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { DeleteFileRequest } from '@kagenti/adk';
import { unwrapResult } from '@kagenti/adk';

import { agentStackClient } from '#api/agentstack-client.ts';

import type { UploadFileParams } from './types';

export async function uploadFile({ file, ...request }: UploadFileParams) {
  const response = await agentStackClient.createFile({ ...request, file: file.originalFile });
  const result = unwrapResult(response);

  return result;
}

export async function deleteFile(request: DeleteFileRequest) {
  const response = await agentStackClient.deleteFile(request);
  const result = unwrapResult(response);

  return result;
}
