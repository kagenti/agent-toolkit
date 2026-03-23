/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Theme } from './types';

export const getThemeClassName = (theme: Theme) => `cds--${theme}`;
