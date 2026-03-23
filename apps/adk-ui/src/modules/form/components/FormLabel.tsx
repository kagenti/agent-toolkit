/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import clsx from 'clsx';
import type { LabelHTMLAttributes } from 'react';

export function FormLabel({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...props} className={clsx('cds--label', className)}>
      {children}
    </label>
  );
}
