/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { getAgentParamsFromUrl } from '#modules/runs/utils.ts';

export function useParamsFromUrl() {
  const pathname = usePathname();

  const params = useMemo(() => getAgentParamsFromUrl(pathname), [pathname]);

  return params;
}
