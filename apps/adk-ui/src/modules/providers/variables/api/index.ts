/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ListProviderVariablesRequest, UpdateProviderVariablesRequest } from '@kagenti/adk';
import { unwrapResult } from '@kagenti/adk';

import { adkClient } from '#api/adk-client.ts';

import type { DeleteProviderVariableRequest } from './types';

export async function listProviderVariables(request: ListProviderVariablesRequest) {
  const response = await adkClient.listProviderVariables(request);
  const result = unwrapResult(response);

  return result;
}

export async function updateProviderVariables(request: UpdateProviderVariablesRequest) {
  const response = await adkClient.updateProviderVariables(request);
  const result = unwrapResult(response);

  return result;
}

export async function deleteProviderVariable({ name, ...request }: DeleteProviderVariableRequest) {
  const response = await adkClient.updateProviderVariables({ ...request, variables: { [name]: null } });
  const result = unwrapResult(response);

  return result;
}
