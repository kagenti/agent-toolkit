/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { UseMutateAsyncFunction } from '@tanstack/react-query';
import type { Context, CreateContextRequest, Task } from '@kagenti/adk';
import { createContext } from 'react';

import type { Agent } from '#modules/agents/api/types.ts';
import type { ContextId } from '#modules/tasks/api/types.ts';

interface PlatformContextValue {
  contextId: ContextId | null;
  initialTasks?: Task[];

  getContextId: () => ContextId;
  resetContext: () => void;
  createContext: UseMutateAsyncFunction<Context, Error, CreateContextRequest>;
  updateContextWithAgentMetadata: (agent: Agent) => Promise<void>;
}

export const PlatformContext = createContext<PlatformContextValue | null>(null);
