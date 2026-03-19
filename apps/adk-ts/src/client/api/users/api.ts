/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CallApi } from '../core/types';
import { ApiMethod } from '../core/types';
import { readUserResponseSchema } from './schemas';

export function createUsersApi(callApi: CallApi) {
  const readUser = () =>
    callApi({
      method: ApiMethod.Get,
      path: '/api/v1/user',
      schema: readUserResponseSchema,
    });

  return {
    readUser,
  };
}
