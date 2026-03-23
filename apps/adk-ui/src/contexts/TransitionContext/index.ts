/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { use } from 'react';

import { RouteTransitionContext } from './context';

export function useRouteTransition() {
  const context = use(RouteTransitionContext);

  if (!context) {
    throw new Error('useRouteTransition must be used within a RouteTransitionProvider');
  }

  return context;
}
