/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */
'use client';
import type { ContextToken } from '@kagenti/adk';
import { createContext } from 'react';

import type { AgentA2AClient } from '#api/a2a/types.ts';

export const A2AClientContext = createContext<A2AClientContextValue | null>(null);

export interface A2AClientContextValue {
  contextToken?: ContextToken;
  agentClient: AgentA2AClient;
}
