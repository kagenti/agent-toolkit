/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type z from 'zod';

import type { networkProviderLocationSchema } from './schemas';

export type NetworkProviderLocation = z.infer<typeof networkProviderLocationSchema>;
