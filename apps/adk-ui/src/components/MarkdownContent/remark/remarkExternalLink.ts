/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Root } from 'hast';
import type { Link } from 'mdast';
import { visit } from 'unist-util-visit';

import { isAbsoluteUrl } from '#utils/url.ts';

export function remarkExternalLink() {
  return (tree: Root) => {
    visit(tree, 'link', (node: Link) => {
      if (isAbsoluteUrl(node.url)) {
        node.data = {
          ...node.data,
          hName: 'externalLink',
        };
      }
    });
  };
}
