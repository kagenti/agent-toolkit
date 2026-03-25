/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

import type { A2AUiExtension } from '../../../../core/extensions/types';
import { trajectoryMetadataSchema } from './schemas';
import type { TrajectoryMetadata } from './types';

export const TRAJECTORY_EXTENSION_URI = 'https://a2a-extensions.adk.kagenti.dev/ui/trajectory/v1';

export const trajectoryExtension: A2AUiExtension<typeof TRAJECTORY_EXTENSION_URI, TrajectoryMetadata[]> = {
  getUri: () => TRAJECTORY_EXTENSION_URI,
  getMessageMetadataSchema: () => z.object({ [TRAJECTORY_EXTENSION_URI]: z.array(trajectoryMetadataSchema) }).partial(),
};
