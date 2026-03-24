/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth, getProvider, signIn } from '#app/(auth)/auth.ts';
import type { ThemePreference } from '#contexts/Theme/theme-context.ts';
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

  return <AutoSignIn signIn={handleSignIn.bind(null, { providerId: authProvider.id, redirectTo: callbackUrl })} />;
}

async function handleSignIn(
  { providerId, redirectTo }: { providerId: string; redirectTo: string },
  theme: ThemePreference,
) {
  'use server';

  try {
    await signIn(providerId, { redirectTo }, { kc_theme: theme });
  } catch (error) {
    // Sign-in can fail for a number of reasons, such as the user not existing, or the user not having the correct role.
    // NextAuth redirects to the error page for auth errors (e.g. Configuration when the provider is unreachable).
    // Re-throw to let Next.js handle the redirect.
    throw error;
  }
}


const AUTH_ERROR_MESSAGES: Record<string, string> = {
  Configuration:
    'Unable to connect to the identity provider. Please verify that the authentication service is running and correctly configured.',
  IdentityProviderUnavailable:
    'Unable to connect to the identity provider. Please verify that the authentication service is running and try again.',
};