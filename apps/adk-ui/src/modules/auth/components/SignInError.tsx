/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { Button, InlineNotification } from '@carbon/react';
import { useRouter } from 'next/navigation';

import { routes } from '#utils/router.ts';

import classes from './AuthErrorPage.module.scss';

interface Props {
  message: string;
  callbackUrl?: string;
}

export function SignInError({ message, callbackUrl = routes.home() }: Props) {
  const router = useRouter();

  return (
    <div className={classes.root}>
      <InlineNotification kind="error" title="Authentication Error" subtitle={message} hideCloseButton lowContrast />
      <Button kind="primary" onClick={() => router.push(routes.signIn({ callbackUrl }))}>
        Try again
      </Button>
    </div>
  );
}
