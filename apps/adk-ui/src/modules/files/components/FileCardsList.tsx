/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

import classes from './FileCardsList.module.scss';

interface Props {
  className?: string;
}

export function FileCardsList({ className, children }: PropsWithChildren<Props>) {
  return <ul className={clsx(classes.root, className)}>{children}</ul>;
}
