/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

export const canvasEditRequestSchema = z.object({
  start_index: z.int(),
  end_index: z.int(),
  description: z.string().nullish(),
  artifact_id: z.string(),
});
