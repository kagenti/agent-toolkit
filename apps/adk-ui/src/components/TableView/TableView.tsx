/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

import classes from './TableView.module.scss';

interface Props {
  description?: string;
  className?: string;
}

export function TableView({ description, className, children }: PropsWithChildren<Props>) {
  return (
    <div className={clsx(classes.root, className)}>
      {description && <p className={classes.description}>{description}</p>}

      <div className={classes.table}>{children}</div>
    </div>
  );
}
