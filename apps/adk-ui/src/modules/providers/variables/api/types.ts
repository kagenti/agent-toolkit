/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { UpdateProviderVariablesRequest } from '@kagenti/adk';

export type DeleteProviderVariableRequest = Omit<UpdateProviderVariablesRequest, 'variables'> & { name: string };
