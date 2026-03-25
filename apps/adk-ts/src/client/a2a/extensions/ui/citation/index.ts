/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

import type { A2AUiExtension } from '../../../../core/extensions/types';
import { citationSchema } from './schemas';
import type { Citation } from './types';

export const CITATION_EXTENSION_URI = 'https://a2a-extensions.adk.kagenti.dev/ui/citation/v1';

export const citationExtension: A2AUiExtension<typeof CITATION_EXTENSION_URI, Citation[]> = {
  getUri: () => CITATION_EXTENSION_URI,
  getMessageMetadataSchema: () => z.object({ [CITATION_EXTENSION_URI]: z.array(citationSchema) }).partial(),
};
