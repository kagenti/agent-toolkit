/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type z from 'zod';

import type { createUserFeedbackRequestSchema, createUserFeedbackResponseSchema } from './schemas';

export type CreateUserFeedbackRequest = z.infer<typeof createUserFeedbackRequestSchema>;
export type CreateUserFeedbackResponse = z.infer<typeof createUserFeedbackResponseSchema>;
