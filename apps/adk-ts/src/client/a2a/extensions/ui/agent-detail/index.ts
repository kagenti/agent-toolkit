/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

import type { A2AUiExtension } from '../../../../core/extensions/types';
import { agentDetailSchema } from './schemas';
import type { AgentDetail } from './types';

export const AGENT_DETAIL_EXTENSION_URI = 'https://a2a-extensions.adk.kagenti.dev/ui/agent-detail/v1';

export const agentDetailExtension: A2AUiExtension<typeof AGENT_DETAIL_EXTENSION_URI, AgentDetail> = {
  getUri: () => AGENT_DETAIL_EXTENSION_URI,
  getMessageMetadataSchema: () => z.object({ [AGENT_DETAIL_EXTENSION_URI]: agentDetailSchema }).partial(),
};
