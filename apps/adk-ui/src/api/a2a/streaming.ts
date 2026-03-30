/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { StreamingPatch } from '@kagenti/adk';

import { extractStreamingMessage } from './utils';

type JsonObject = Record<string, unknown>;

function step(node: unknown, key: string): unknown {
  if (Array.isArray(node)) {
    return node[Number(key)];
  }

  if (node && typeof node === 'object') {
    return node[key];
  }

  return undefined;
}

function setAt(parent: unknown, key: string, value: unknown): void {
  if (!parent || typeof parent !== 'object') {
    return;
  }

  if (Array.isArray(parent)) {
    parent[Number(key)] = value;
  } else {
    parent[key] = value;
  }
}

/**
 * Traverse a JSON pointer path, returning [parent, lastKey].
 * Both are used together to read or write the target location.
 */
function resolvePath(obj: JsonObject, path: string): [unknown, string] {
  if (path === '' || path === '/') {
    return [obj, ''];
  }

  const segments = path.split('/').filter(Boolean);
  const lastKey = segments[segments.length - 1];
  const parent = segments.slice(0, -1).reduce(step, obj);

  return [parent, lastKey];
}

/** Clone objects; primitives are immutable and pass through as-is. */
function cloneValue<T>(value: T): T {
  return typeof value === 'object' && value !== null ? structuredClone(value) : value;
}

/**
 * Apply a single streaming patch to a draft message object.
 * Supports: replace, add, str_ins (custom string insertion).
 *
 * Note: RFC 6902 `remove` and `move` ops are intentionally not implemented.
 * The server-side accumulator only emits replace/add/str_ins deltas for
 * progressive text construction. Add them here if that changes.
 */
function applyPatch(draft: JsonObject, patch: StreamingPatch): void {
  const { op, path, value, pos } = patch;

  if (op === 'replace') {
    if (path === '' || path === '/') {
      Object.keys(draft).forEach((key) => delete draft[key]);

      if (value && typeof value === 'object') {
        Object.assign(draft, cloneValue(value));
      }
    } else {
      const [parent, key] = resolvePath(draft, path);

      setAt(parent, key, cloneValue(value));
    }
  } else if (op === 'add') {
    if (path.endsWith('/-')) {
      const [parent, key] = resolvePath(draft, path.slice(0, -2));
      const arr = step(parent, key);

      if (Array.isArray(arr)) {
        arr.push(cloneValue(value));
      }
    } else {
      const [parent, key] = resolvePath(draft, path);

      if (Array.isArray(parent)) {
        parent.splice(Number(key), 0, cloneValue(value));
      } else {
        setAt(parent, key, cloneValue(value));
      }
    }
  } else if (op === 'str_ins') {
    const [parent, key] = resolvePath(draft, path);
    const current = step(parent, key);

    if (typeof current === 'string' && typeof value === 'string') {
      const insertPos = pos ?? 0;

      setAt(parent, key, current.slice(0, insertPos) + value + current.slice(insertPos));
    }
  } else {
    console.warn(`Unsupported streaming patch op: "${op}". Skipping.`);
  }
}

/**
 * Extract streaming patches from status update metadata.
 */
export function extractStreamingPatches(metadata: JsonObject | undefined | null): StreamingPatch[] | null {
  const streamingData = extractStreamingMessage(metadata);

  return streamingData?.message_update?.length ? streamingData.message_update : null;
}

/**
 * Apply an array of streaming patches to a draft message object.
 * Mutates the draft in place and returns it.
 */
export function applyPatches(draft: JsonObject, patches: StreamingPatch[]): JsonObject {
  patches.forEach((patch) => applyPatch(draft, patch));

  return draft;
}
