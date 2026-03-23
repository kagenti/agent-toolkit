/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AgentDetailTool } from '@kagenti/adk';

import { LineClampText } from '#components/LineClampText/LineClampText.tsx';

import classes from './AgentTool.module.scss';

interface Props {
  tool: AgentDetailTool;
}

export function AgentTool({ tool }: Props) {
  const { name, description } = tool;

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <p className={classes.name}>{name}</p>
      </div>

      {description && (
        <LineClampText className={classes.description} buttonClassName={classes.viewMore} lines={3}>
          {description}
        </LineClampText>
      )}
    </div>
  );
}
