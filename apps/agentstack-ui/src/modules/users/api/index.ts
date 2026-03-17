/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { unwrapResult } from '@kagenti/adk';

import { adkClient } from '#api/agentstack-client.ts';

export async function readUser() {
  const response = await adkClient.readUser();
  const result = unwrapResult(response);

  return result;
}
