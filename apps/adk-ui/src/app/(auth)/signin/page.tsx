/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { SignInView } from '#modules/auth/components/SignInView.tsx';

interface Props {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const { callbackUrl, error } = await searchParams;

  return <SignInView callbackUrl={callbackUrl} error={error} />;
}
