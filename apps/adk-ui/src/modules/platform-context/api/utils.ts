/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { HistoryItem, HistoryMessage } from './types';

export function isHistoryMessage(item: HistoryItem): item is HistoryMessage {
  return 'messageId' in item;
}
