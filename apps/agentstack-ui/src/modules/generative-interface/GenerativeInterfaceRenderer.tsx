/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ActionProvider,
  ComponentRegistry,
  Components,
  DataProvider,
  Renderer,
  SetData,
  VisibilityProvider,
} from '@json-render/react';
import { defineCatalog, Spec } from '@json-render/core';
import { schema } from '@json-render/react';
import { z } from 'zod';
import { ReactNode, useMemo, useRef } from 'react';

export const catalog = defineCatalog(schema, {
  components: {
    Button: {
      props: z.object({
        label: z.string(),
        action: z.string(),
      }),
      description: 'Clickable button',
    },
  },
  actions: {
    confirm_button: { description: 'Agree' },
  },
});

export const components: Components<typeof catalog> = {
  Button: ({ props, onAction, loading }) => (
    <button
      onClick={() =>
        onAction?.({
          name: props.action,
        })
      }
    >
      {loading ? '...' : props.label}
    </button>
  ),
};

interface RendererProps {
  spec: Spec | null;
  data?: Record<string, unknown>;
  setData?: SetData;
  onDataChange?: (path: string, value: unknown) => void;
  loading?: boolean;
}

// Build registry - uses refs to avoid recreating on data changes
function buildRegistry(
  dataRef: React.RefObject<Record<string, unknown>>,
  setDataRef: React.RefObject<SetData | undefined>,
  loading?: boolean,
): ComponentRegistry {
  const registry: ComponentRegistry = {};

  for (const [name, componentFn] of Object.entries(components)) {
    registry[name] = (renderProps: { element: { props: Record<string, unknown> }; children?: ReactNode }) =>
      componentFn({
        props: renderProps.element.props as never,
        children: renderProps.children,
        onAction: (a) => {
          const setData = setDataRef.current;
          const data = dataRef.current;
          if (setData) {
            // executeAction(a.name, a.params, setData, data);
          }
        },
        loading,
      });
  }

  return registry;
}

const fallbackRegistry = (renderProps: { element: { type: string } }) => (
  <div>Fallback: {renderProps.element.type}</div>
);

export function GenerativeInterfaceRenderer({ spec, data = {}, setData, onDataChange, loading }: RendererProps) {
  // Use refs to keep registry stable while still accessing latest data/setData
  const dataRef = useRef(data);
  const setDataRef = useRef(setData);
  dataRef.current = data;
  setDataRef.current = setData;

  // Memoize registry - only changes when loading changes
  const registry = useMemo(() => buildRegistry(dataRef, setDataRef, loading), [loading]);

  if (!spec) return null;

  return (
    <DataProvider initialData={data} onDataChange={onDataChange}>
      <VisibilityProvider>
        <ActionProvider>
          <Renderer spec={spec} registry={registry} fallback={fallbackRegistry} loading={loading} />
        </ActionProvider>
      </VisibilityProvider>
    </DataProvider>
  );
}
