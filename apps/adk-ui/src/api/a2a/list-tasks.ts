/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Task } from '@kagenti/adk';
import { v4 as uuid } from 'uuid';

import { ensureToken } from '#app/(auth)/rsc.tsx';
import { runtimeConfig } from '#contexts/App/runtime-config.ts';
import { getBaseUrl } from '#utils/api/getBaseUrl.ts';

export interface ListTasksParams {
  contextId?: string;
  status?: string;
  pageSize?: number;
  pageToken?: string;
}

export interface ListTasksResponse {
  tasks: Task[];
  nextPageToken?: string;
  totalSize?: number;
  pageSize?: number;
}

/**
 * Server-side function to fetch tasks from the A2A proxy via JSON-RPC.
 * Used in React Server Components.
 */
export async function fetchTasksForContext(
  providerId: string,
  contextId: string,
): Promise<ListTasksResponse | undefined> {
  try {
    const baseUrl = getBaseUrl();
    const endpointUrl = `${baseUrl}/api/v1/a2a/${providerId}/`;

    const { isAuthEnabled } = runtimeConfig;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (isAuthEnabled) {
      const token = await ensureToken();
      if (token?.accessToken) {
        headers['Authorization'] = `Bearer ${token.accessToken}`;
      }
    }

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: uuid(),
        method: 'ListTasks',
        params: {
          contextId,
        },
      }),
    });

    if (!response.ok) {
      console.error(`ListTasks request failed: ${response.status} ${response.statusText}`);
      return undefined;
    }

    const data = await response.json();

    if (data.error) {
      console.error('ListTasks error:', data.error);
      return undefined;
    }

    return data.result as ListTasksResponse;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return undefined;
  }
}
