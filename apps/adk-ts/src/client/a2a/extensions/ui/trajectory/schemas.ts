/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

export const trajectoryMetadataSchema = z.object({
  title: z.string().nullish(),
  content: z.string().nullish(),
  group_id: z.string().nullish(),
});
