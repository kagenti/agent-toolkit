/**
 * Copyright 2026 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { RecentlyViewed } from '@carbon/icons-react';
import { IconButton } from '@carbon/react';

import { useApp } from '#contexts/App/index.ts';

interface Props {
  className?: string;
}

export function SessionsButton({ className }: Props) {
  const { openNavbar } = useApp();

  return (
    <div className={className}>
      <IconButton label="Sessions" size="sm" kind="ghost" autoAlign align="right" onClick={() => openNavbar()}>
        <RecentlyViewed />
      </IconButton>
    </div>
  );
}
