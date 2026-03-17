/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { permanentRedirect } from 'next/navigation';

import { routes } from '#utils/router.ts';

export default async function AgentBasePage() {
  permanentRedirect(routes.home());
}
