/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type z from 'zod';

import type { citationMetadataSchema, citationSchema } from './schemas';

export type Citation = z.infer<typeof citationSchema>;

export type CitationMetadata = z.infer<typeof citationMetadataSchema>;
