/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  connectorPresetSchema as sdkConnectorPresetSchema,
  connectorSchema as sdkConnectorSchema,
  listConnectorPresetsResponseSchema as sdkListConnectorPresetsResponseSchema,
  listConnectorsResponseSchema as sdkListConnectorsResponseSchema,
} from '@kagenti/adk';
import z from 'zod';

export const connectorMetadataSchema = z
  .object({
    name: z.string().optional(),
  })
  .nullable();

export const connectorSchema = sdkConnectorSchema.extend({
  metadata: connectorMetadataSchema,
});
export type Connector = z.infer<typeof connectorSchema>;

export const listConnectorsResponseSchema = sdkListConnectorsResponseSchema.extend({
  items: z.array(connectorSchema),
});
export type ListConnectorsResponse = z.infer<typeof listConnectorsResponseSchema>;

export const connectorPresetMetadataSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const connectorPresetSchema = sdkConnectorPresetSchema.extend({
  metadata: connectorPresetMetadataSchema.nullable(),
});
export type ConnectorPreset = z.infer<typeof connectorPresetSchema>;

export const listConnectorPresetsResponseSchema = sdkListConnectorPresetsResponseSchema.extend({
  items: z.array(connectorPresetSchema),
});
export type ListConnectorPresetsResponse = z.infer<typeof listConnectorPresetsResponseSchema>;
