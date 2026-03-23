/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RunRunFormValues {
  input: string;
  tools?: string[];
}

export interface RunStats {
  startTime?: number;
  endTime?: number;
}
