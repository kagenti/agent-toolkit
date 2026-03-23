/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { use } from 'react';

import { PlatformContext } from './platform-context';

export function usePlatformContext() {
  const context = use(PlatformContext);

  if (!context) {
    throw new Error('usePlatformContext must be used within a PlatformContextProvider');
  }

  return context;
}
