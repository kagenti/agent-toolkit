/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { UITrajectoryPart } from '#modules/messages/types.ts';

export type NonViewableTrajectoryProperty = keyof Pick<UITrajectoryPart, 'kind' | 'id'>;
