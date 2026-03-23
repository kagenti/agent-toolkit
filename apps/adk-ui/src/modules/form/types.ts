/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { FormField, FormFieldValue } from '@kagenti/adk';

export type RunFormValues = Record<string, FormFieldValue>;

export type ValueOfField<F extends FormField> = Extract<FormFieldValue, { type: F['type'] }>;
export type ValuesOfField<F extends FormField> = Record<string, ValueOfField<F>>;
