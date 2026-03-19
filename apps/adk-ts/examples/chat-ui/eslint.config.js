/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import baseConfig from 'kagenti/lint-config/eslint';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([...baseConfig, reactHooks.configs.flat['recommended-latest']]);
