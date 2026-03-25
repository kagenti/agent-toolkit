/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { StreamingMetadata, StreamingPatch } from '@kagenti/adk';
import { STREAMING_EXTENSION_URI } from '@kagenti/adk';

/**
 * Extract streaming patches from status update metadata.
 */
export function extractStreamingPatches(
  metadata: Record<string, unknown> | undefined | null,
): StreamingPatch[] | null {
  if (!metadata) return null;
  const streamingData = metadata[STREAMING_EXTENSION_URI] as StreamingMetadata | undefined;
  if (!streamingData?.message_update?.length) return null;
  return streamingData.message_update;
}

/**
 * Resolve a JSON pointer path to get/set a value in a nested object.
 * Returns [parent, key] for the target location.
 */
function resolvePath(obj: Record<string, unknown>, path: string): [Record<string, unknown>, string] {
  if (path === '' || path === '/') return [obj, ''];

  const parts = path.split('/').filter(Boolean);
  let current: unknown = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (Array.isArray(current)) {
      current = current[Number(key)];
    } else if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[key];
    }
  }

  return [current as Record<string, unknown>, parts[parts.length - 1]];
}

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  if (path === '' || path === '/') return obj;
  const parts = path.split('/').filter(Boolean);
  let current: unknown = obj;
  for (const key of parts) {
    if (Array.isArray(current)) {
      current = current[Number(key)];
    } else if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

/** Clone only objects; primitives (strings, numbers, booleans) are immutable and don't need cloning. */
function cloneValue<T>(v: T): T {
  return typeof v === 'object' && v !== null ? structuredClone(v) : v;
}

/**
 * Apply a single streaming patch to a draft message object.
 * Supports: replace, add, str_ins (custom string insertion).
 */
function applyPatch(draft: Record<string, unknown>, patch: StreamingPatch): void {
  const { op, path, value } = patch;

  if (op === 'replace') {
    if (path === '' || path === '/') {
      // Root replace — overwrite entire draft
      Object.keys(draft).forEach((key) => delete draft[key]);
      if (value && typeof value === 'object') {
        Object.assign(draft, cloneValue(value));
      }
    } else {
      const [parent, key] = resolvePath(draft, path);
      if (parent && typeof parent === 'object') {
        if (Array.isArray(parent)) {
          parent[Number(key)] = cloneValue(value);
        } else {
          parent[key] = cloneValue(value);
        }
      }
    }
  } else if (op === 'add') {
    if (path.endsWith('/-')) {
      // Append to array
      const arrayPath = path.slice(0, -2);
      const arr = getByPath(draft, arrayPath);
      if (Array.isArray(arr)) {
        arr.push(cloneValue(value));
      }
    } else {
      const [parent, key] = resolvePath(draft, path);
      if (parent && typeof parent === 'object') {
        if (Array.isArray(parent)) {
          parent.splice(Number(key), 0, cloneValue(value));
        } else {
          parent[key] = cloneValue(value);
        }
      }
    }
  } else if (op === 'str_ins') {
    // Custom operation: insert string at position
    const pos = patch.pos ?? 0;
    const current = getByPath(draft, path);
    if (typeof current === 'string' && typeof value === 'string') {
      const newValue = current.slice(0, pos) + value + current.slice(pos);
      const [parent, key] = resolvePath(draft, path);
      if (parent && typeof parent === 'object') {
        if (Array.isArray(parent)) {
          parent[Number(key)] = newValue;
        } else {
          parent[key] = newValue;
        }
      }
    }
  }
}

/**
 * Apply an array of streaming patches to a draft message object.
 * Mutates the draft in place and returns it.
 */
export function applyPatches(
  draft: Record<string, unknown>,
  patches: StreamingPatch[],
): Record<string, unknown> {
  for (const patch of patches) {
    applyPatch(draft, patch);
  }
  return draft;
}
