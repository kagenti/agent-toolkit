/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { ErrorPage } from '#components/ErrorPage/ErrorPage.tsx';

export default function Page() {
  return <ErrorPage message={'There was an error loading the page.'} />;
}
