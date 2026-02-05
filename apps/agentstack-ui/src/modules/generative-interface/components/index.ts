/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ComponentType } from 'react';

import type { ButtonProps } from './Button';
import { Button } from './Button';

export type ComponentRegistry = {
  Button: ComponentType<ButtonProps>;
};

export const components: ComponentRegistry = {
  Button,
};
