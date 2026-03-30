/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { type PropsWithChildren, useCallback, useMemo } from 'react';

import { useImmerWithGetter } from '#hooks/useImmerWithGetter.ts';
import { convertTasksToUIMessages } from '#modules/history/utils.ts';
import type { UIMessage } from '#modules/messages/types.ts';
import { usePlatformContext } from '#modules/platform-context/contexts/index.ts';

import { MessagesContext } from './messages-context';

export function MessagesProvider({ children }: PropsWithChildren) {
  const { initialTasks } = usePlatformContext();

  const [messages, getMessages, setMessages] = useImmerWithGetter<UIMessage[]>(
    convertTasksToUIMessages(initialTasks ?? []),
  );

  const isLastMessage = useCallback((message: UIMessage) => getMessages().at(0)?.id === message.id, [getMessages]);

  const value = useMemo(
    () => ({
      messages,
      getMessages,
      setMessages,
      isLastMessage,
      queryControl: {
        fetchNextPageInViewAnchorRef: { current: null } as React.RefObject<HTMLDivElement | null>,
        isFetching: false,
        isFetchingNextPage: false,
        hasNextPage: false,
      },
    }),
    [messages, getMessages, setMessages, isLastMessage],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}
