/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import z from 'zod';

export const componentNodeSchema: z.ZodType<{
  type: string;
  props?: Record<string, unknown>;
  children: unknown[];
}> = z.lazy(() =>
  z.object({
    type: z.string(),
    props: z.record(z.string(), z.unknown()).optional(),
    children: z.array(componentNodeSchema).default([]),
  }),
);

export const generativeInterfaceSpecSchema = z.object({
  root: componentNodeSchema,
});

export const generativeInterfaceResponseSchema = z.object({
  component_id: z.string(),
  event_type: z.string(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const generativeInterfaceDemandsSchema = z.object({
  generative_interface_demands: z.object({}).optional(),
});

export const generativeInterfaceFulfillmentsSchema = z.object({
  generative_interface_fulfillments: z.object({
    catalog_prompt: z.string(),
  }),
});
