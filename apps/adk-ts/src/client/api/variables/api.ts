/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CallApi } from '../core/types';
import { ApiMethod } from '../core/types';
import { listVariablesResponseSchema, updateVariablesResponseSchema } from './schemas';
import type { UpdateVariablesRequest } from './types';

export function createVariablesApi(callApi: CallApi) {
  const listVariables = () =>
    callApi({
      method: ApiMethod.Get,
      path: '/api/v1/variables',
      schema: listVariablesResponseSchema,
    });

  const updateVariables = ({ ...body }: UpdateVariablesRequest) =>
    callApi({
      method: ApiMethod.Put,
      path: '/api/v1/variables',
      schema: updateVariablesResponseSchema,
      body,
    });

  return {
    listVariables,
    updateVariables,
  };
}
