/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { use } from 'react';

import { AgentStatusContext } from './agent-status-context';

export function useAgentStatus() {
  const context = use(AgentStatusContext);

  if (!context) {
    throw new Error('useAgentStatus must be used within a AgentStatusProvider');
  }

  return context;
}
