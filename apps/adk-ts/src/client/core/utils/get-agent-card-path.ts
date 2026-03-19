/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

export function getAgentCardPath(providerId: string) {
  return `api/v1/a2a/${providerId}/.well-known/agent-card.json`;
}
