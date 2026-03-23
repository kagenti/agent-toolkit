/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { type CreateUserFeedbackRequest, unwrapResult } from '@kagenti/adk';

import { adkClient } from '#api/adk-client.ts';

export async function sendFeedback(request: CreateUserFeedbackRequest) {
  const response = await adkClient.createUserFeedback(request);
  const result = unwrapResult(response);

  return result;
}
