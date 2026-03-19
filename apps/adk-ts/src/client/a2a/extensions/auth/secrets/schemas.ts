/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

export const secretDemandSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
});

export const secretDemandsSchema = z.object({
  secret_demands: z.record(z.string(), secretDemandSchema),
});

export const secretFulfillmentSchema = z.object({
  secret: z.string(),
});

export const secretFulfillmentsSchema = z.object({
  secret_fulfillments: z.record(z.string(), secretFulfillmentSchema),
});
