/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { ProgressProvider } from '@bprogress/next/app';
import type { PropsWithChildren } from 'react';

export function ProgressBarProvider({ children }: PropsWithChildren) {
  return (
    <ProgressProvider color="#0f62fe" height="3px" options={{ showSpinner: false }} shallowRouting>
      {children}
    </ProgressProvider>
  );
}
