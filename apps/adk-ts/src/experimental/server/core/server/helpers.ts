/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

export function createAgentCardUrl(host: string, port: number, selfRegistrationId?: string) {
  return `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}${selfRegistrationId ? `#${selfRegistrationId}` : ''}`;
}
