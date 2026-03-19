/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { OverflowMenuHorizontal } from '@carbon/icons-react';
import { OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { useMemo } from 'react';

import { useRouteTransition } from '#contexts/TransitionContext/index.ts';
import { useParamsFromUrl } from '#hooks/useParamsFromUrl.ts';
import { isNotNull } from '#utils/helpers.ts';
import { routes } from '#utils/router.ts';

import classes from './AgentNav.module.scss';

export function AgentNav() {
  const { providerId } = useParamsFromUrl();
  const { transitionTo } = useRouteTransition();

  const items = useMemo(() => {
    if (!providerId) {
      return null;
    }

    return [
      {
        label: 'Settings',
        href: routes.agentSettings({ providerId }),
      },
      {
        label: 'About',
        href: routes.agentAbout({ providerId }),
      },
    ].filter(isNotNull);
  }, [providerId]);

  if (!items) {
    return null;
  }

  return (
    <OverflowMenu
      renderIcon={OverflowMenuHorizontal}
      aria-label="Agent options"
      size="sm"
      className={classes.button}
      menuOptionsClass={classes.menu}
      flipped
    >
      {items.map((item) => (
        <OverflowMenuItem key={item.label} itemText={item.label} onClick={() => transitionTo(item.href)} />
      ))}
    </OverflowMenu>
  );
}
