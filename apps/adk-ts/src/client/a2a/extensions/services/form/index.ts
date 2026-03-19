/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { A2AServiceExtension } from '../../../../core/extensions/types';
import { formDemandsSchema, formFulfillmentsSchema } from './schemas';
import type { FormDemands, FormFulfillments } from './types';

export const FORM_EXTENSION_URI = 'https://a2a-extensions.adk.kagenti.dev/services/form/v1';

export const formExtension: A2AServiceExtension<typeof FORM_EXTENSION_URI, FormDemands, FormFulfillments> = {
  getUri: () => FORM_EXTENSION_URI,
  getDemandsSchema: () => formDemandsSchema,
  getFulfillmentsSchema: () => formFulfillmentsSchema,
};
