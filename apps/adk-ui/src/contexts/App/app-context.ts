/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { createContext } from 'react';

import type { RuntimeConfig, SidePanelVariant } from './types';

export const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppContextValue {
  config: RuntimeConfig;
  navbarOpen: boolean;
  activeSidePanel: SidePanelVariant | null;
  openNavbar: () => void;
  closeNavbar: () => void;
  openSidePanel: (variant: SidePanelVariant) => void;
  closeSidePanel: () => void;
}
