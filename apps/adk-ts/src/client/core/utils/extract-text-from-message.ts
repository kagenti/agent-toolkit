/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Message, TextPart } from '../../a2a/protocol/types';

export function extractTextFromMessage(message: Message | undefined) {
  const text = message?.parts
    .filter((part): part is TextPart => 'text' in part)
    .map((part) => part.text)
    .join('\n');

  return text;
}
