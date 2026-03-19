/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CSSProperties } from 'react';

import { useScrollbarWidth } from './useScrollbarWidth';

export function useScrollbar() {
  const { ref, scrollbarWidth } = useScrollbarWidth();

  const style = { '--scrollbar-width': `${scrollbarWidth}px` } as CSSProperties;

  return {
    ref,
    style,
  };
}
