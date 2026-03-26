/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */
'use client';

import type { RefObject } from 'react';
import { createContext } from 'react';

import type { Updater } from '#hooks/useImmerWithGetter.ts';
import type { UIMessage } from '#modules/messages/types.ts';

export const MessagesContext = createContext<MessagesContextValue | null>(null);

export interface MessagesContextValue {
  messages: UIMessage[];
  isLastMessage: (message: UIMessage) => boolean;
  getMessages: () => UIMessage[];
  setMessages: Updater<UIMessage[]>;
  queryControl: {
    fetchNextPageInViewAnchorRef: RefObject<HTMLDivElement | null>;
    isFetching: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
  };
}
