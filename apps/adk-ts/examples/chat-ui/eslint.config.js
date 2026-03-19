/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import baseConfig from '@kagenti/adk-lint-config/eslint';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([...baseConfig, reactHooks.configs.flat['recommended-latest']]);
