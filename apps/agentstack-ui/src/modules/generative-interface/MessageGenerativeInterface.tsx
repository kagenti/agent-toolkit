/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useCallback } from 'react';

import { useMessages } from '#modules/messages/contexts/Messages/index.ts';
import type { UIAgentMessage } from '#modules/messages/types.ts';
import { getMessageGenerativeInterface } from '#modules/messages/utils.ts';
import { useAgentRun } from '#modules/runs/contexts/agent-run/index.ts';

import { GenerativeInterfaceRenderer } from './GenerativeInterfaceRenderer';

interface Props {
  message: UIAgentMessage;
}

export function MessageGenerativeInterface({ message }: Props) {
  const part = getMessageGenerativeInterface(message);
  const { submitGenerativeInterface } = useAgentRun();
  const { isLastMessage } = useMessages();

  const handleInteraction = useCallback(
    (componentId: string, eventType: string, payload?: Record<string, unknown>) => {
      if (!part || !isLastMessage(message)) {
        return;
      }

      submitGenerativeInterface(
        {
          component_id: componentId,
          event_type: eventType,
          payload,
        },
        part.taskId,
      );
    },
    [part, message, isLastMessage, submitGenerativeInterface],
  );

  if (!part) {
    return null;
  }

  return (
    <GenerativeInterfaceRenderer
      spec={{
        root: 'foobar',
        elements: {
          foobar: { key: 'foobar', type: 'Button', props: { title: 'Hello' } },
        },
      }}
    />
  );
}
