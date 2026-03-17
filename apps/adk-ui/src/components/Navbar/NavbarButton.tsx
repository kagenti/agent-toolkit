/**
 * Copyright 2026 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button } from '@carbon/react';
import clsx from 'clsx';
import type { ComponentType } from 'react';

import classes from './NavbarButton.module.scss';

interface Props {
  onClick?: () => void;
  href?: string;
  icon: ComponentType;
  hoverIcon?: ComponentType;
  label: string;
}

export function NavbarButton({ onClick, href, icon: Icon, hoverIcon: HoverIcon, label }: Props) {
  return (
    <Button className={classes.root} kind="ghost" size="sm" onClick={onClick} href={href}>
      <div className={clsx(classes.icon, { [classes.withHoverIcon]: Boolean(HoverIcon) })}>
        <Icon />

        {HoverIcon && <HoverIcon />}
      </div>

      <span className={classes.label}>{label}</span>
    </Button>
  );
}
