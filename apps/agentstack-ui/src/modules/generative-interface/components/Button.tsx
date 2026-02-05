/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { Button as CarbonButton } from '@carbon/react';
import type { ComponentProps, ComponentType } from 'react';

export interface ButtonProps {
  id: string;
  label: string;
  kind?: 'primary' | 'secondary' | 'tertiary';
  onInteraction?: (componentId: string, eventType: string, payload?: Record<string, unknown>) => void;
}

export const Button: ComponentType<ButtonProps> = ({ id, label, kind = 'primary', onInteraction }) => {
  return (
    <CarbonButton
      kind={kind as ComponentProps<typeof CarbonButton>['kind']}
      size="md"
      onClick={() => onInteraction?.(id, 'click')}
    >
      {label}
    </CarbonButton>
  );
};
