/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  ConnectConnectorRequest,
  CreateConnectorRequest,
  DeleteConnectorRequest,
  DisconnectConnectorRequest,
} from '@kagenti/adk';
import { unwrapResult } from '@kagenti/adk';

import { adkClient } from '#api/agentstack-client.ts';
import { BASE_URL } from '#utils/constants.ts';

import { connectorSchema, listConnectorPresetsResponseSchema, listConnectorsResponseSchema } from './types';

export async function listConnectors() {
  const response = await adkClient.listConnectors();
  const result = unwrapResult(response, listConnectorsResponseSchema);

  return result;
}

export async function createConnector(request: CreateConnectorRequest) {
  const response = await adkClient.createConnector(request);
  const result = unwrapResult(response, connectorSchema);

  return result;
}

export async function deleteConnector(request: DeleteConnectorRequest) {
  const response = await adkClient.deleteConnector(request);
  const result = unwrapResult(response);

  return result;
}

export async function connectConnector(request: ConnectConnectorRequest) {
  const response = await adkClient.connectConnector({
    redirect_url: `${BASE_URL}/oauth-callback`,
    ...request,
  });
  const result = unwrapResult(response, connectorSchema);

  return result;
}

export async function disconnectConnector(request: DisconnectConnectorRequest) {
  const response = await adkClient.disconnectConnector(request);
  const result = unwrapResult(response, connectorSchema);

  return result;
}

export async function listConnectorPresets() {
  const response = await adkClient.listConnectorPresets();
  const result = unwrapResult(response, listConnectorPresetsResponseSchema);

  return result;
}
