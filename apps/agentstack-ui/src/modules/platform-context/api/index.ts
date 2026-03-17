/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  CreateContextRequest,
  CreateContextTokenRequest,
  DeleteContextRequest,
  ListContextHistoryRequest,
  ListContextsRequest,
} from '@kagenti/adk';
import { type MatchModelProvidersRequest, unwrapResult } from '@kagenti/adk';

import { adkClient } from '#api/agentstack-client.ts';
import { fetchEntity } from '#api/utils.ts';

import type { PatchContextMetadataRequest } from './types';
import { contextSchema, listContextsResponseSchema } from './types';

export async function listContexts(request: ListContextsRequest) {
  const response = await adkClient.listContexts(request);
  const result = unwrapResult(response, listContextsResponseSchema);

  return result;
}

export async function createContext(request: CreateContextRequest) {
  const response = await adkClient.createContext(request);
  const result = unwrapResult(response, contextSchema);

  return result;
}

export async function deleteContext(request: DeleteContextRequest) {
  const response = await adkClient.deleteContext(request);
  const result = unwrapResult(response);

  return result;
}

export async function listContextHistory(request: ListContextHistoryRequest) {
  const response = await adkClient.listContextHistory(request);
  const result = unwrapResult(response);

  return result;
}

export async function patchContextMetadata(request: PatchContextMetadataRequest) {
  const response = await adkClient.patchContextMetadata(request);
  const result = unwrapResult(response, contextSchema);

  return result;
}

export async function matchModelProviders(request: MatchModelProvidersRequest) {
  const response = await adkClient.matchModelProviders(request);
  const result = unwrapResult(response);

  return result;
}

export async function createContextToken(request: CreateContextTokenRequest) {
  const response = await adkClient.createContextToken(request);
  const result = unwrapResult(response);

  return result;
}

export async function fetchContextHistory(request: ListContextHistoryRequest) {
  return await fetchEntity(() => listContextHistory(request));
}
