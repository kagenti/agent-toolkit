/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */
'use server';

import { isHttpError } from '@kagenti/adk';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getToken } from 'next-auth/jwt';

import { isUnauthenticatedError } from '#api/errors.ts';
import { logErrorDetails } from '#api/utils.ts';
import { runtimeConfig } from '#contexts/App/runtime-config.ts';
import { routes } from '#utils/router.ts';

import { auth, AUTH_COOKIE_NAME, AUTH_SECRET } from './auth';

export async function ensureToken() {
  const { isAuthEnabled } = runtimeConfig;

  if (!isAuthEnabled) {
    return null;
  }

  const session = await auth();
  if (!session) {
    return null;
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  // Synthetic request with cookies from next/headers — getToken only reads cookies, not the URL
  const req = new Request('https://n', { headers: { cookie: cookieHeader } });

  const token = await getToken({ req, cookieName: AUTH_COOKIE_NAME, secret: AUTH_SECRET });

  return token;
}

export async function handleApiError(error: unknown) {
  logErrorDetails(error);

  if (isUnauthenticatedError(error)) {
    redirect(routes.signIn());
  } else if (isHttpError(error, 404) || isHttpError(error, 422)) {
    notFound();
  }
}
