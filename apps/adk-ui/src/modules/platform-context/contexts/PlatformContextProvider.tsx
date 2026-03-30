/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */
'use client';
import type { Task } from '@kagenti/adk';
import { type PropsWithChildren, useCallback, useState } from 'react';

import type { Agent } from '#modules/agents/api/types.ts';

import { useCreateContext } from '../api/mutations/useCreateContext';
import { usePatchContextMetadata } from '../api/mutations/usePatchContextMetadata';
import { PlatformContext } from './platform-context';

interface Props {
  contextId?: string;
  initialTasks?: Task[];
}

export function PlatformContextProvider({ initialTasks, contextId: contextIdProp, children }: PropsWithChildren<Props>) {
  const [contextId, setContextId] = useState<string | null>(contextIdProp ?? null);

  const { mutateAsync: createContext } = useCreateContext({
    onSuccess: ({ id }) => {
      setContextId(id);
    },
  });

  const { mutateAsync: patchContextMetadata } = usePatchContextMetadata();

  const resetContext = useCallback(() => {
    setContextId(null);
  }, []);

  const updateContextWithAgentMetadata = useCallback(
    async (agent: Agent) => {
      if (!contextId) {
        return;
      }

      await patchContextMetadata({
        context_id: contextId,
        metadata: {
          agent_name: agent.name,
          provider_id: agent.provider.id,
        },
      });
    },
    [contextId, patchContextMetadata],
  );

  const getContextId = useCallback(() => {
    if (!contextId) {
      throw new Error('Context ID is not set');
    }

    return contextId;
  }, [contextId]);

  return (
    <PlatformContext.Provider
      value={{
        contextId,
        initialTasks,
        createContext,
        getContextId,
        resetContext,
        updateContextWithAgentMetadata,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}
