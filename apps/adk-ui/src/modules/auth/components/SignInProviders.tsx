/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth, getProvider, signIn } from '#app/(auth)/auth.ts';
import { runtimeConfig } from '#contexts/App/runtime-config.ts';
import { routes } from '#utils/router.ts';

import { AuthErrorPage } from './AuthErrorPage';
import { AutoSignIn } from './AutoSignIn';
import { SignInError } from './SignInError';

interface Props {
  callbackUrl?: string;
  error?: string;
}

const authProvider = getProvider();

export async function SignInProviders({ callbackUrl = routes.home(), error }: Props) {
  if (!authProvider) {
    return null;
  }

  if (error) {
    const message = AUTH_ERROR_MESSAGES[error] ?? 'An unexpected authentication error occurred. Please try again.';
    return <SignInError message={message} callbackUrl={callbackUrl} />;
  }

  const session = await auth();
  const hasExistingToken = session?.user != null;

  if (hasExistingToken) {
    return <AuthErrorPage callbackUrl={callbackUrl} />;
  }

  const signInAction = runtimeConfig.isLocalDevAutoLogin
    ? handleLocalDevSignIn.bind(null, callbackUrl)
    : handleSignIn.bind(null, { providerId: authProvider.id, redirectTo: callbackUrl });

  return <AutoSignIn signIn={signInAction} />;
}

async function handleLocalDevSignIn(redirectTo: string) {
  'use server';
  await signIn('local-dev', { username: 'admin', password: 'admin', redirectTo });
}

async function handleSignIn({ providerId, redirectTo }: { providerId: string; redirectTo: string }) {
  'use server';

  try {
    await signIn(providerId, { redirectTo });
  } catch (error) {
    throw error;
  }
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  Configuration:
    'Unable to connect to the identity provider. Please verify that the authentication service is running and correctly configured.',
  IdentityProviderUnavailable:
    'Unable to connect to the identity provider. Please verify that the authentication service is running and try again.',
};
