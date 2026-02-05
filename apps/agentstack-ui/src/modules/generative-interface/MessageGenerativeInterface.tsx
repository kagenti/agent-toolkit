/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import type { UIAgentMessage } from '#modules/messages/types.ts';
import { getMessageGenerativeInterface } from '#modules/messages/utils.ts';

import { GenerativeInterfaceRenderer } from './GenerativeInterfaceRenderer';

interface Props {
  message: UIAgentMessage;
}

export function MessageGenerativeInterface({ message }: Props) {
  const part = getMessageGenerativeInterface(message);

  if (!part) {
    return null;
  }

  return <GenerativeInterfaceRenderer spec={part.spec} />;
}
