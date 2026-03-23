/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import type { IntersectionOptions } from 'react-intersection-observer';
import { useInView } from 'react-intersection-observer';

interface Props extends Omit<IntersectionOptions, 'onChange'> {
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export function useFetchNextPage({
  hasNextPage,
  isFetching,
  skip,
  rootMargin = '160px 0px 0px 0px',
  fetchNextPage,
  ...inViewProps
}: Props) {
  const inViewReturn = useInView({
    skip: skip ?? !hasNextPage,
    rootMargin,
    onChange: (inView) => {
      if (inView && !isFetching) {
        fetchNextPage();
      }
    },
    ...inViewProps,
  });

  // For cases where the guard element stays in view after the new page fetch
  // so the onChange doesn't trigger again
  useEffect(() => {
    if (inViewReturn.entry?.isIntersecting && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inViewReturn.entry?.isIntersecting, isFetching, fetchNextPage]);

  return inViewReturn;
}
