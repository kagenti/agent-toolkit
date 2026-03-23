/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>;
};
