/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

export const platformApiMetadataSchema = z.object({
  base_url: z.string().nullish(),
  auth_token: z.string(),
  expires_at: z.string().nullish(),
});
