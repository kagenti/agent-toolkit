/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { unwrapResult } from '@kagenti/adk';

import { adkClient } from '#api/adk-client.ts';

export async function readSystemConfiguration() {
  const response = await adkClient.readSystemConfiguration();
  const result = unwrapResult(response);

  return result;
}
