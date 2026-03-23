/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { use } from 'react';

import { AgentDemandsContext } from './agent-demands-context';

export function useAgentDemands() {
  const context = use(AgentDemandsContext);

  if (!context) {
    throw new Error('useAgentDemands must be used within an AgentDemandsProvider');
  }

  return context;
}
