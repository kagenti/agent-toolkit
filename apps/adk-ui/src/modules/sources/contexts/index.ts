/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { use } from 'react';

import { SourcesContext } from './sources-context';

export function useSources() {
  const context = use(SourcesContext);

  if (!context) {
    throw new Error('useSources must be used within a SourcesProvider');
  }

  return context;
}
