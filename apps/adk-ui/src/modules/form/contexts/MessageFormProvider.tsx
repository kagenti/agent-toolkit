/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { PropsWithChildren } from 'react';

import { MessageFormContext, type MessageFormContextValue } from './message-form-context';

export function MessageFormProvider({ children, ...props }: PropsWithChildren<MessageFormContextValue>) {
  return <MessageFormContext.Provider value={props}>{children}</MessageFormContext.Provider>;
}
