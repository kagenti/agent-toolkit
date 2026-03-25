/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { buildApiClient } from '@kagenti/adk';

import { ensureToken } from '#app/(auth)/rsc.tsx';
import { runtimeConfig } from '#contexts/App/runtime-config.ts';
import { getBaseUrl } from '#utils/api/getBaseUrl.ts';

function buildAuthenticatedAdkClient() {
  const { isAuthEnabled } = runtimeConfig;
  const baseUrl = getBaseUrl();

  const authenticatedFetch: typeof fetch = async (url, init) => {
    const request = new Request(url, init);

    if (isAuthEnabled) {
      const token = await ensureToken();

      if (token?.accessToken) {
        request.headers.set('Authorization', `Bearer ${token.accessToken}`);
      }
    }

    const response = await fetch(request);

    return response;
  };

  const client = buildApiClient({ baseUrl, fetch: authenticatedFetch });

  return client;
}

export const adkClient = buildAuthenticatedAdkClient();
