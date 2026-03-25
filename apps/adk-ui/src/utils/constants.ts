/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export const API_URL = process.env.API_URL ?? 'http://adk-api.localtest.me:8080';

export const PROD_MODE = process.env.NODE_ENV === 'production';

export const DOCUMENTATION_LINK = 'https://github.com/kagenti/adk/tree/main/docs/stable';

export const TRUST_PROXY_HEADERS = (process.env.TRUST_PROXY_HEADERS ?? 'false').toLowerCase() === 'true';

export const NEXTAUTH_URL = process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL) : undefined;

export const THEME_STORAGE_KEY = '@kagenti/adk/THEME';

export const AGENT_SECRETS_SETTINGS_STORAGE_KEY = '@kagenti/adk/AGENT-SECRETS-SETTINGS';

export const MODEL_SETUP_COMMAND = 'kagenti-adk model setup';
