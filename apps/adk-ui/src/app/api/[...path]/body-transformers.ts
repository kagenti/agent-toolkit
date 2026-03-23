/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { createProxyUrl } from '#utils/api/getProxyUrl.ts';

export async function transformAgentManifestBody(response: Response) {
  try {
    const body = await response.json();

    const modifiedBody = {
      ...body,
      ...(body.supportedInterfaces && {
        supportedInterfaces: body.supportedInterfaces.map((item: { url: string }) => ({
          ...item,
          url: createProxyUrl(item.url),
        })),
      }),
    };

    return JSON.stringify(modifiedBody);
  } catch (err) {
    throw new Error('There was an error transforming agent manifest file.', err);
  }
}
