/**
 * Copyright 2026 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import { Settings } from '@carbon/icons-react';

import { UserNav } from '#components/Navbar/UserNav.tsx';
import { useApp } from '#contexts/App/index.ts';
import { useParamsFromUrl } from '#hooks/useParamsFromUrl.ts';
import { routes } from '#utils/router.ts';

import { NavbarButton } from './NavbarButton';

export function FooterNav() {
  const {
    config: { isAuthEnabled },
  } = useApp();

  const { providerId } = useParamsFromUrl();

  return isAuthEnabled ? (
    <UserNav />
  ) : (
    <NavbarButton icon={Settings} label="Settings" href={routes.settings({ providerId })} />
  );
}
