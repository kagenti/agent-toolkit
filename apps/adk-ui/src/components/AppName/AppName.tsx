/**
 * Copyright 2026 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useApp } from '#contexts/App/index.ts';
import { routes, TransitionLink } from '#index.ts';

import classes from './AppName.module.scss';

interface Props {
  withLink?: boolean;
}

export function AppName({ withLink }: Props) {
  const {
    config: { appName },
  } = useApp();

  const content = <span className={classes.name}>{appName}</span>;

  return withLink ? (
    <TransitionLink className={classes.link} href={routes.home()}>
      {content}
    </TransitionLink>
  ) : (
    content
  );
}
