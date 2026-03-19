/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { use } from 'react';

import { AgentSecretsContext } from './agent-secrets-context';

export function useAgentSecrets() {
  return use(AgentSecretsContext);
}
