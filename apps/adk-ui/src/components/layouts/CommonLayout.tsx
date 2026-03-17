/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { PropsWithChildren } from 'react';

import { CommonFooter } from './CommonFooter';
import { CommonHeader } from './CommonHeader';
import classes from './CommonLayout.module.scss';

export function CommonLayout({ children }: PropsWithChildren) {
  return (
    <div className={classes.root}>
      <CommonHeader />
      <main data-route-transition className={classes.main}>
        {children}
      </main>
      <CommonFooter />
    </div>
  );
}
