/**
 * Copyright 2026 © IBM Corp.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Toggle } from '@carbon/react';
import type { CheckboxField, CheckboxGroupField, CheckboxGroupFieldValue } from '@kagenti/adk';
import { useController } from 'react-hook-form';

import { getFieldName } from '#modules/form/utils.ts';

import classes from './ToggleSettingsField.module.scss';

interface Props {
  field: CheckboxField;
  groupField: CheckboxGroupField;
}

export function ToggleSettingsField({ field, groupField }: Props) {
  const { id, content } = field;

  const groupName = getFieldName(groupField);
  const name = `${groupName}.${id}` as const;

  const {
    field: { value, onChange },
  } = useController<Record<string, CheckboxGroupFieldValue>, typeof name>({ name });

  return (
    <Toggle
      className={classes.root}
      id={name}
      labelA={content}
      labelB={content}
      size="sm"
      onToggle={onChange}
      toggled={Boolean(value)}
    />
  );
}
