/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AgentDetail, Provider } from '@kagenti/adk';

type AgentCard = Provider['agent_card'];
type AgentCardProvider = AgentCard['provider'];

export interface Agent extends Omit<AgentCard, 'provider'> {
  provider: Omit<Provider, 'agent_card'> & {
    metadata?: AgentCardProvider;
  };
  ui: AgentDetail;
}

export type AgentExtension = NonNullable<Agent['capabilities']['extensions']>[number];

export enum ListAgentsOrderBy {
  Name = 'name',
  CreatedAt = 'created_at',
  LastActiveAt = 'last_active_at',
}
