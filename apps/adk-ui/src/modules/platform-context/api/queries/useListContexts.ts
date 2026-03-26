/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ListContextsRequest } from '@kagenti/adk';
import { useInfiniteQuery } from '@tanstack/react-query';

import { isNotNull } from '#utils/helpers.ts';

import { listContexts } from '..';
import { contextKeys } from '../keys';

export function useListContexts(params: ListContextsRequest = {}) {
  const query = useInfiniteQuery({
    queryKey: contextKeys.list(params),
    queryFn: ({ pageParam }: { pageParam?: string }) => {
      const { query } = params;

      return listContexts({
        query: {
          ...query,
          page_token: pageParam,
        },
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.has_more && lastPage.next_page_token ? lastPage.next_page_token : undefined,
    select: (data) => {
      const items = data.pages.flatMap((page) => page?.items).filter(isNotNull);

      return items;
    },
  });

  return query;
}
