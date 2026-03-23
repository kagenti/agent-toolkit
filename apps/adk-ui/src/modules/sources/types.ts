/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { UISourcePart } from '#modules/messages/types.ts';

export interface MessageSourcesMap {
  [messageId: string]: UISourcePart[];
}

export const CITATION_LINK_PREFIX = 'citation:';
