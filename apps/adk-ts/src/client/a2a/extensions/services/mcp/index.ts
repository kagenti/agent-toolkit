/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { A2AServiceExtension } from '../../../../core/extensions/types';
import { mcpDemandsSchema, mcpFulfillmentsSchema } from './schemas';
import type { MCPDemands, MCPFulfillments } from './types';

export const MCP_EXTENSION_URI = 'https://a2a-extensions.adk.kagenti.dev/services/mcp/v1';

export const mcpExtension: A2AServiceExtension<typeof MCP_EXTENSION_URI, MCPDemands, MCPFulfillments> = {
  getUri: () => MCP_EXTENSION_URI,
  getDemandsSchema: () => mcpDemandsSchema,
  getFulfillmentsSchema: () => mcpFulfillmentsSchema,
};
