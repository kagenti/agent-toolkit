/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type z from 'zod';

import type { canvasEditRequestSchema } from './schemas';

export type CanvasEditRequest = z.infer<typeof canvasEditRequestSchema>;
