/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type z from 'zod';

import type { streamingMetadataSchema, streamingPatchSchema } from './schemas';

export type StreamingPatch = z.infer<typeof streamingPatchSchema>;

export type StreamingMetadata = z.infer<typeof streamingMetadataSchema>;
