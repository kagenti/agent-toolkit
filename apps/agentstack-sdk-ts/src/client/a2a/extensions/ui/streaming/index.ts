/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

import type { A2AUiExtension } from '../../../../core/extensions/types';
import { streamingMetadataSchema } from './schemas';
import type { StreamingMetadata } from './types';

export type { StreamingMetadata, StreamingPatch } from './types';
export { streamingMetadataSchema, streamingPatchSchema } from './schemas';

export const STREAMING_EXTENSION_URI = 'https://a2a-extensions.agentstack.beeai.dev/ui/streaming/v1';

export const streamingExtension: A2AUiExtension<typeof STREAMING_EXTENSION_URI, StreamingMetadata> = {
  getUri: () => STREAMING_EXTENSION_URI,
  getMessageMetadataSchema: () => z.object({ [STREAMING_EXTENSION_URI]: streamingMetadataSchema }).partial(),
};
