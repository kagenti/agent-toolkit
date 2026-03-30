/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { notFound } from 'next/navigation';

import { fetchTasksForContext } from '#api/a2a/list-tasks.ts';
import { runtimeConfig } from '#contexts/App/runtime-config.ts';
import { PlatformContextProvider } from '#modules/platform-context/contexts/PlatformContextProvider.tsx';
import { RunView } from '#modules/runs/components/RunView.tsx';

import { ensureModelSelected } from '../../../app/(main)/agent/[providerId]/ensure-model-selected';
import { fetchAgent } from '../../../app/(main)/agent/[providerId]/rsc';

interface Props {
  providerId: string;
  contextId?: string;
}

export async function AgentRun({ providerId, contextId }: Props) {
  const { featureFlags } = runtimeConfig;

  const agentPromise = fetchAgent(providerId);
  const tasksPromise = contextId ? fetchTasksForContext(providerId, contextId) : undefined;

  const agent = await agentPromise;

  if (featureFlags.LocalSetup) {
    const { ErrorComponent } = await ensureModelSelected(agent);

    if (ErrorComponent) {
      return ErrorComponent;
    }
  }

  const tasksResponse = await tasksPromise;

  if (contextId && !tasksResponse) {
    notFound();
  }

  return (
    <PlatformContextProvider contextId={contextId} initialTasks={tasksResponse?.tasks}>
      <RunView agent={agent} />
    </PlatformContextProvider>
  );
}
