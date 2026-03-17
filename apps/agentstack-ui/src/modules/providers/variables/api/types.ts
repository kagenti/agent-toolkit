/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { UpdateProviderVariablesRequest } from '@kagenti/adk';

export type DeleteProviderVariableRequest = Omit<UpdateProviderVariablesRequest, 'variables'> & { name: string };
