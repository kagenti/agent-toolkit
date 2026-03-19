/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { use } from 'react';

import { FileUploadContext } from './file-upload-context';

export function useFileUpload() {
  const context = use(FileUploadContext);

  if (!context) {
    throw new Error('useFileUpload must be used within a FileUploadProvider');
  }

  return context;
}
