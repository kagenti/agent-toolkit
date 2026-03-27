/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';

import { auth, getProvider, signIn } from '#app/(auth)/auth.ts';
import { runtimeConfig } from '#contexts/App/runtime-config.ts';
import { routes } from '#utils/router.ts';

import { AuthErrorPage } from './AuthErrorPage';
import { AutoSignIn } from './AutoSignIn';

interface Props {
  callbackUrl?: string;
}

const authProvider = getProvider();

export async function SignInProviders({ callbackUrl = routes.home() }: Props) {
  if (!authProvider) {
    return null;
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
    // Sign-in can fail for a number of reasons, such as the user not existing, or the user not having the correct role.
    // In some cases, you may want to redirect to a custom error.
    if (error instanceof AuthError) {
      return redirect(routes.error({ error }));
    }

    throw error;
  }
}
