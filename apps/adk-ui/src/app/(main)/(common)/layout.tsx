/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonLayout } from '#components/layouts/CommonLayout.tsx';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CommonLayout>{children}</CommonLayout>;
}
