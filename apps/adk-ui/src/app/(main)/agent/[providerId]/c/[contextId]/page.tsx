/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentRun } from '#modules/runs/components/AgentRun.tsx';

interface Props {
  params: Promise<{ providerId: string; contextId: string }>;
}

export default async function AgentRunPage({ params }: Props) {
  const { providerId, contextId } = await params;

  return <AgentRun providerId={providerId} contextId={contextId} />;
}
