/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

import { contextTokenPermissionsDefaults } from '#modules/platform-context/constants.ts';
import { contextTokenPermissionsSchema } from '#modules/platform-context/types.ts';
import { featureFlagsDefaults, featureFlagsSchema } from '#utils/feature-flags.ts';
import { loadEnvConfig } from '#utils/helpers.ts';

import type { RuntimeConfig } from './types';

const oidcIssuerSchema = z
  .string()
  .optional()
  .transform((val) => val?.includes('localtest.me') ?? false);

export const runtimeConfig: RuntimeConfig = {
  featureFlags: loadEnvConfig({
    schema: featureFlagsSchema,
    input: process.env.FEATURE_FLAGS,
    defaults: featureFlagsDefaults,
  }),
  contextTokenPermissions: loadEnvConfig({
    schema: contextTokenPermissionsSchema,
    input: process.env.CONTEXT_TOKEN_PERMISSIONS,
    defaults: contextTokenPermissionsDefaults,
  }),
  isAuthEnabled: process.env.OIDC_ENABLED !== 'false',
  isLocalDevAutoLogin: process.env.OIDC_ENABLED !== 'false' && oidcIssuerSchema.parse(process.env.OIDC_PROVIDER_ISSUER),
  appName: process.env.APP_NAME || 'Kagenti ADK',
};
