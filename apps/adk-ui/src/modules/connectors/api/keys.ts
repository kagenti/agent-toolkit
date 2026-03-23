/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

export const connectorKeys = {
  all: () => ['connectors'] as const,
  list: () => [...connectorKeys.all(), 'list'] as const,
  presetsList: () => [...connectorKeys.all(), 'presets'] as const,
};
