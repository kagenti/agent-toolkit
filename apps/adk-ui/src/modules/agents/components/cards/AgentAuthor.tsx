/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { SkeletonText } from '@carbon/react';
import type { AgentDetailContributor } from '@kagenti/adk';

import classes from './AgentAuthor.module.scss';

interface Props {
  author: AgentDetailContributor;
}

export function AgentAuthor({ author }: Props) {
  const { name } = author;

  return (
    <p className={classes.root}>
      <span className={classes.name}>{name}</span>
    </p>
  );
}

AgentAuthor.Skeleton = function AgentAuthorSkeleton() {
  return <SkeletonText className={classes.root} />;
};
