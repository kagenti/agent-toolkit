/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */
'use client';

import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { createContext } from 'react';

interface RouteTransitionContextValue {
  transitionTo: (href: string, options?: NavigateOptions) => Promise<void>;
}

export const RouteTransitionContext = createContext<RouteTransitionContextValue>(
  null as unknown as RouteTransitionContextValue,
);
