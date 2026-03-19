/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import clsx from 'clsx';

import { SessionsNav } from '#modules/history/components/SessionsNav.tsx';

import classes from './NavbarMainContent.module.scss';

interface Props {
  className?: string;
}

export function NavbarMainContent({ className }: Props) {
  return (
    <div className={clsx(classes.root, className)}>
      <SessionsNav className={classes.sessions} />
    </div>
  );
}
