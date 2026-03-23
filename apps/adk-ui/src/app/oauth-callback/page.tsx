/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useEffect } from 'react';

export default function OAuthCallbackPage() {
  useEffect(() => {
    window.opener.postMessage({ redirect_uri: window.location.href }, window.origin);
  }, []);

  return null;
}
