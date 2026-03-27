/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';
import { useEffect } from 'react';

interface Props {
  signIn: () => Promise<void>;
}

export function AutoSignIn({ signIn }: Props) {
  useEffect(() => {
    void signIn();
  }, [signIn]);
  return <div>Redirecting to login...</div>;
}
