/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

export const featureFlagsSchema = z.strictObject({
  Connectors: z.boolean().optional(),
  LocalSetup: z.boolean().optional(),
  Providers: z.boolean().optional(),
  Variables: z.boolean().optional(),
});

export type FeatureFlags = z.infer<typeof featureFlagsSchema>;
export type FeatureName = keyof FeatureFlags;

export const featureFlagsDefaults: Required<FeatureFlags> = {
  Connectors: false,
  LocalSetup: false,
  Providers: false,
  Variables: false,
};
