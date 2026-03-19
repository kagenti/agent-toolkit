/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

import { UserRole } from './types';

export const userRoleSchema = z.enum(UserRole);

export const userSchema = z.object({
  id: z.string(),
  role: userRoleSchema,
  email: z.string(),
  created_at: z.string(),
});

export const readUserRequestSchema = z.never();

export const readUserResponseSchema = userSchema;
