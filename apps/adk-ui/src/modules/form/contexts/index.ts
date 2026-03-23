/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { use } from 'react';

import { MessageFormContext } from './message-form-context';

export function useMessageForm() {
  const context = use(MessageFormContext);

  if (!context) {
    throw new Error('useMessageForm must be used within an MessageFormProvider');
  }

  return context;
}
