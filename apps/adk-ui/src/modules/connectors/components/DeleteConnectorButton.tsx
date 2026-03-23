/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeleteButton } from '#components/DeleteButton/DeleteButton.tsx';

import { useDeleteConnector } from '../api/mutations/useDeleteConnector';
import type { Connector } from '../api/types';

interface Props {
  connector: Connector;
}

export function DeleteConnectorButton({ connector }: Props) {
  const { mutate: deleteConnector, isPending } = useDeleteConnector();

  const { id, url } = connector;

  return (
    <DeleteButton
      entityName={url}
      entityLabel="connector"
      isPending={isPending}
      onSubmit={() => deleteConnector({ connector_id: id })}
    />
  );
}
