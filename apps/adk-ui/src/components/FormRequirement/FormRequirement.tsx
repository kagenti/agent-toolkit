/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { PropsWithChildren } from 'react';

export function FormRequirement({ children }: PropsWithChildren) {
  return <div className="cds--form-requirement">{children}</div>;
}
