/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import { FooterNav } from '#components/Navbar/FooterNav.tsx';

import classes from './CommonFooter.module.scss';

export function CommonFooter() {
  return (
    <div className={classes.root}>
      <div className={classes.nav}>
        <FooterNav />
      </div>
    </div>
  );
}
