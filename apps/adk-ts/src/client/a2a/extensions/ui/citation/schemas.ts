/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

export const citationSchema = z.object({
  url: z.string().nullish(),
  start_index: z.number().nullish(),
  end_index: z.number().nullish(),
  title: z.string().nullish(),
  description: z.string().nullish(),
});

export const citationMetadataSchema = z.array(citationSchema);
