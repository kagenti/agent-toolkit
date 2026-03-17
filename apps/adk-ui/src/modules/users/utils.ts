/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { type User, UserRole } from '@kagenti/adk';

export function isUserAdminOrDev(user: User | undefined) {
  if (!user) {
    return false;
  }

  const { role } = user;

  return role === UserRole.Admin || role === UserRole.Developer;
}
