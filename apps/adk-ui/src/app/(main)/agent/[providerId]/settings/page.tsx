/**
 * Copyright 2026 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentSettingsView } from '#modules/agents/components/detail/AgentSettingsView.tsx';

import { fetchAgent } from '../rsc';

interface Props {
  params: Promise<{ providerId: string }>;
}

export default async function AgentSettingsPage({ params }: Props) {
  const { providerId } = await params;

  const agent = await fetchAgent(providerId);

  return <AgentSettingsView agent={agent} />;
}
