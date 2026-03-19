/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import { ArrowLeft } from '@carbon/icons-react';
import { SkeletonText } from '@carbon/react';

import { AppHeader } from '#components/layouts/AppHeader.tsx';
import { TransitionLink } from '#components/TransitionLink/TransitionLink.tsx';
import { useParamsFromUrl } from '#hooks/useParamsFromUrl.ts';
import { useAgent } from '#modules/agents/api/queries/useAgent.ts';
import { routes } from '#utils/router.ts';

import classes from './AgentHeader.module.scss';
import { AgentNav } from './AgentNav';
import { AgentShareButton } from './AgentShareButton';

export function AgentHeader() {
  const { providerId, subRoute } = useParamsFromUrl();
  const { data: agent } = useAgent({ providerId });

  if (!providerId) {
    return null;
  }

  return (
    <AppHeader>
      <div className={classes.root}>
        <h1 className={classes.agentName}>
          {agent ? (
            subRoute ? (
              <TransitionLink href={routes.agentRun({ providerId })} className={classes.backLink}>
                <ArrowLeft />
                {agent.name}
              </TransitionLink>
            ) : (
              agent.name
            )
          ) : (
            <SkeletonText />
          )}
        </h1>

        <div className={classes.buttons}>
          <AgentShareButton providerId={providerId} />
          <AgentNav />
        </div>
      </div>
    </AppHeader>
  );
}
