/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { contextPermissionsGrantSchema, globalPermissionsGrantSchema } from '@kagenti/adk';
import z from 'zod';

export const contextTokenPermissionsSchema = z.object({
  grant_global_permissions: globalPermissionsGrantSchema.optional(),
  grant_context_permissions: contextPermissionsGrantSchema.optional(),
});

export type ContextTokenPermissions = z.infer<typeof contextTokenPermissionsSchema>;
