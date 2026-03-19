/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { unwrapResult } from '@kagenti/adk';

import { adkClient } from '#api/adk-client.ts';

export async function readUser() {
  const response = await adkClient.readUser();
  const result = unwrapResult(response);

  return result;
}
