/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import { LogoGithub } from '@carbon/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Container } from '#components/layouts/Container.tsx';
import { MainContent } from '#components/layouts/MainContent.tsx';
import { ExternalLink } from '#components/MarkdownContent/components/ExternalLink.tsx';
import { MarkdownContent } from '#components/MarkdownContent/MarkdownContent.tsx';
import { ViewHeader } from '#components/ViewHeader/ViewHeader.tsx';
import type { Agent } from '#modules/agents/api/types.ts';
import { fadeProps } from '#utils/fadeProps.ts';

import { AgentCredits } from './AgentCredits';
import classes from './AgentDetailView.module.scss';
import { AgentToolsList } from './AgentToolsList';

interface Props {
  agent: Agent;
}

export function AgentDetailView({ agent }: Props) {
  const {
    description,
    documentationUrl,
    ui: { contributors, author },
  } = agent;

  return (
    <MainContent>
      <Container size="sm">
        <AnimatePresence>
          <motion.div {...agentDetailFadeProps} key="header">
            <ViewHeader heading="Agent details" />
          </motion.div>

          <div className={classes.main}>
            <div className={classes.mainInfo}>
              {documentationUrl && (
                <motion.div {...agentDetailFadeProps} key="documentationLink">
                  <ExternalLink href={documentationUrl} className={classes.documentationLink}>
                    View source code <LogoGithub />
                  </ExternalLink>
                </motion.div>
              )}

              <motion.div {...agentDetailFadeProps} key="description">
                {description && <MarkdownContent className={classes.description}>{description}</MarkdownContent>}
              </motion.div>
            </div>

            {/* <AgentTags agent={agent} /> */}

            {(author || contributors) && (
              <>
                <motion.hr />
                <motion.div {...agentDetailFadeProps} key="credits">
                  <AgentCredits author={author} contributors={contributors} />
                </motion.div>
              </>
            )}

            <motion.hr />

            <motion.div {...agentDetailFadeProps} className={classes.tools}>
              <h2>Tools</h2>
              <AgentToolsList agent={agent} />
            </motion.div>
          </div>
        </AnimatePresence>
      </Container>
    </MainContent>
  );
}

export const agentDetailFadeProps = {
  ...fadeProps({
    hidden: {
      marginBlockStart: '0.75rem',
    },
    visible: {
      marginBlockStart: '0',
    },
  }),
};
