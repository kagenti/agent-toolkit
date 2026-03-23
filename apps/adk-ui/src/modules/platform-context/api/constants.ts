/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ListContextHistoryRequest, ListContextsRequest } from '@kagenti/adk';

export const LIST_CONTEXTS_DEFAULT_QUERY: ListContextsRequest['query'] = { limit: 10, include_empty: false };

export const LIST_CONTEXT_HISTORY_DEFAULT_QUERY: ListContextHistoryRequest['query'] = { limit: 10 };
