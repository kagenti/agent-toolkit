/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, type Dispatch, type SetStateAction } from 'react';

export interface MessageFormContextValue {
  showSubmission: boolean;
  setShowSubmission: Dispatch<SetStateAction<boolean>>;
}

export const MessageFormContext = createContext<MessageFormContextValue | null>(null);
