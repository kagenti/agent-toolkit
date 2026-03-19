/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { notFound, permanentRedirect } from 'next/navigation';

import { routes } from '#utils/router.ts';

interface Props {
  params: Promise<{ providerId: string }>;
}

export default async function AgentRunPage({ params }: Props) {
  const { providerId } = await params;

  // Redirect to new URL structure
  if (providerId) {
    permanentRedirect(routes.agentRun({ providerId }));
  }

  notFound();
}
