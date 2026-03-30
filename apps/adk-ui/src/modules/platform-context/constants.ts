/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { DeepRequired } from '#@types/utils.ts';

import type { ContextTokenPermissions } from './types';

export const contextTokenPermissionsDefaults: DeepRequired<ContextTokenPermissions> = {
  grant_global_permissions: {
    files: [],
    feedback: [],
    vector_stores: [],
    llm: ['*'],
    embeddings: ['*'],
    model_providers: [],
    a2a_proxy: ['*'],
    providers: ['read'],
    provider_variables: [],
    contexts: [],
    context_data: [],
    connectors: [],
  },
  grant_context_permissions: {
    files: ['*'],
    vector_stores: ['*'],
    context_data: ['*'],
  },
};
