/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import type { PluggableList } from 'unified';

import { remarkExternalLink } from './remarkExternalLink';
import { remarkMermaid } from './remarkMermaid';

export const remarkPlugins = [
  remarkGfm,
  [remarkMath, { singleDollarTextMath: false }],
  remarkMermaid,
  remarkExternalLink,
] satisfies PluggableList;
