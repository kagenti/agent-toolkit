/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

export const streamingPatchSchema = z.object({
  op: z.string(),
  path: z.string(),
  value: z.unknown().optional(),
  pos: z.number().optional(), // for str_ins
});

export const streamingMetadataSchema = z.object({
  message_update: z.array(streamingPatchSchema).optional(),
  message_id: z.string().optional(),
});
