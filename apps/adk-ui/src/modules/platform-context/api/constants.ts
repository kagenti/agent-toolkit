/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ListContextsRequest } from '@kagenti/adk';

export const LIST_CONTEXTS_DEFAULT_QUERY: ListContextsRequest['query'] = { limit: 10, include_empty: false };
