/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

export const networkProviderLocationSchema = z.string();

export const readableStreamSchema = z.custom<ReadableStream<Uint8Array<ArrayBuffer>>>(
  (value) => value instanceof ReadableStream,
  { error: 'Expected ReadableStream' },
);
