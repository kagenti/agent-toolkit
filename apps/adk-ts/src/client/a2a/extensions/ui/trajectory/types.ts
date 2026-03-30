/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type z from 'zod';

import type { trajectoryMetadataSchema, trajectorySchema } from './schemas';

export type Trajectory = z.infer<typeof trajectorySchema>;

export type TrajectoryMetadata = z.infer<typeof trajectoryMetadataSchema>;
