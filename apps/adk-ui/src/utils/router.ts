/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AuthError } from 'next-auth';

export const routes = {
  home: () => '/' as const,
  error: ({ error }: { error: AuthError }) => `/error?error=${error.type}`,
  signIn: ({ callbackUrl }: { callbackUrl?: string } = {}) =>
    `/signin${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`,
  notFound: () => '/not-found' as const,
  agentRoute: ({ providerId }: AgentRouteParams) => `/agent/${encodeURIComponent(providerId)}`,
  agentRun: ({ providerId, contextId }: AgentRunParams) =>
    `${routes.agentRoute({ providerId })}${contextId ? `/c/${encodeURIComponent(contextId)}` : ''}`,
  agentSettings: (params: AgentRouteParams) => `${routes.agentRoute(params)}/settings`,
  agentAbout: (params: AgentRouteParams) => `${routes.agentRoute(params)}/about`,
  settings: ({ providerId }: Partial<AgentRouteParams> = {}) =>
    providerId ? `${routes.agentRoute({ providerId })}/global-settings` : '/settings',
};

interface AgentRouteParams {
  providerId: string;
}

interface AgentRunParams extends AgentRouteParams {
  contextId?: string;
}
