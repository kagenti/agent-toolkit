/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CreateFileRequest } from '@kagenti/adk';

import type { FileEntity } from '../types';

export type UploadFileParams = Omit<CreateFileRequest, 'file'> & { file: FileEntity };
