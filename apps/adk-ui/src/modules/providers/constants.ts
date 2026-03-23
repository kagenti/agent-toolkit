/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderSource } from './types';

export const ProviderSourcePrefixes = {
  [ProviderSource.GitHub]: 'git+',
  [ProviderSource.Docker]: '',
} as const;
