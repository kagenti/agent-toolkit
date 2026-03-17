/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { UpdateVariablesRequest } from '@kagenti/adk';
import { unwrapResult } from '@kagenti/adk';

import { adkClient } from '#api/agentstack-client.ts';

export async function listVariables() {
  const response = await adkClient.listVariables();
  const result = unwrapResult(response);

  return result;
}

export async function updateVariables(request: UpdateVariablesRequest) {
  const response = await adkClient.updateVariables(request);
  const result = unwrapResult(response);

  return result;
}
