/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Fulfillments, TaskStatusUpdateResult, UserMetadataInputs } from '@kagenti/adk';

import type { UIMessagePart, UIUserMessage } from '#modules/messages/types.ts';
import type { ContextId, TaskId } from '#modules/tasks/api/types.ts';

import type { buildA2AClient } from './client';

export enum RunResultType {
  Parts = 'parts',
}

export interface PartsResult<UIGenericPart = never> {
  type: RunResultType.Parts;
  taskId: TaskId;
  parts: Array<UIMessagePart | UIGenericPart>;
  replace?: boolean;
}

export type TaskStatusUpdateResultWithTaskId = TaskStatusUpdateResult & {
  taskId: TaskId;
};

export type ChatResult<UIGenericPart = never> = PartsResult<UIGenericPart> | TaskStatusUpdateResultWithTaskId;
export type ChatSubscriptionData<UIGenericPart = never> = Pick<
  PartsResult<UIGenericPart>,
  'taskId' | 'parts' | 'replace'
>;

export interface ChatParams {
  message: UIUserMessage;
  contextId: ContextId;
  fulfillments: Fulfillments;
  inputs: UserMetadataInputs;
  taskId?: TaskId;
}

export interface ChatRun<UIGenericPart = never> {
  taskId?: TaskId;
  done: Promise<null | TaskStatusUpdateResultWithTaskId>;
  subscribe: (fn: (data: ChatSubscriptionData<UIGenericPart>) => void) => () => void;
  cancel: () => Promise<void>;
}

export type AgentA2AClient<UIGenericPart = never> = Awaited<ReturnType<typeof buildA2AClient<UIGenericPart>>>;
