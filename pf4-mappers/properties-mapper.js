/* eslint react/no-array-index-key: "off" */

import React, { Fragment } from 'react';
import {
  Button,
  FormGroup,
  TextArea,
  TextInput,
  Switch
} from '@patternfly/react-core';
import { TrashIcon, PlusIcon, TrashRestoreIcon } from '@patternfly/react-icons';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper';

const Input = ({
  label,
  onChange,
  value,
  autoFocus,
  type,
  isDisabled,
  restricted,
  propertyName,
  fieldId,
  ...rest
}) => {
  return (
    <Fragment>
      <FormGroup label={label} fieldId={label}>
        <TextInput
          id={label}
          type={type}
          autoFocus={autoFocus}
          onChange={(value) => onChange(value)}
          value={value || ''}
          isDisabled={isDisabled}
          {...rest}
        />
      </FormGroup>
    </Fragment>
  );
};

const PropertySwitch = ({ value, onChange, label, isDisabled }) => {
  return (
    <FormGroup fieldId={label}>
      <Switch
        isChecked={Boolean(value)}
        id={`${label}-property`}
        onChange={(checked) => onChange(checked)}
        label={label}
        isDisabled={isDisabled}
      />
    </FormGroup>
  );
};

const PropertySelect = ({ value, label, onChange, options }) => {
  return (
    <FormGroup label={label} fieldId={label}>
      <rawComponents.Select
        id={label}
        value={value || ''}
        options={options.map((option) => ({ value: option, label: option }))}
        onChange={(value) => onChange(value)}
      />
    </FormGroup>
  );
};

const PropertyOptions = ({ value = [], label, onChange }) => {
  const handleOptionChange = (option, index, optionKey) =>
    onChange(
      value.map((item, itemIndex) =>
        index === itemIndex ? { ...item, [optionKey]: option } : item
      )
    );
  const handleRemove = (index, restoreable) => {
    let options;
    if (restoreable) {
      options = value.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              deleted: !item.deleted
            }
          : item
      );
    } else {
      options = value.filter((_item, itemIndex) => itemIndex !== index);
    }
    return onChange(options.length > 0 ? options : undefined);
  };
  return (
    <div>
      <p
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <span>{label}</span>
        <Button
          onClick={() => onChange([...value, { value: '', label: '' }])}
          variant="plain"
          aria-label="add option"
        >
          <PlusIcon />
        </Button>
      </p>
      <table className="pf4-options-property-editor-table">
        <tbody>
          {value.map(({ label, value, restoreable, deleted }, index, allOptions) => (
            <tr key={index}>
              <td className="pf4-options-propery-editor-cell">
                <TextInput
                  aria-label={`option-label-${index}`}
                  autoFocus
                  isDisabled={deleted}
                  placeholder="Label"
                  onChange={(value) => handleOptionChange(value, index, 'label')}
                  value={label || ''}
                  type="text"
                />
              </td>
              <td className="pf4-options-propery-editor-cell">
                <TextInput
                  aria-label={`option-value-${index}`}
                  onKeyPress={({ key }) => {
                    if (key === 'Enter' && index === allOptions.length - 1) {
                      onChange([...allOptions, { value: '', label: '' }]);
                    }
                  }}
                  placeholder="Value"
                  isDisabled={deleted}
                  onChange={(value) => handleOptionChange(value, index, 'value')}
                  value={value || ''}
                  type="text"
                />
              </td>
              <td>
                <Button
                  onClick={() => handleRemove(index, restoreable)}
                  variant="plain"
                  aria-label="delete option"
                >
                  {deleted ? (
                    <TrashRestoreIcon className="pf4-success-color" />
                  ) : (
                    <TrashIcon className="pf4-danger-color" />
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Textarea = ({ label, onChange, value, autoFocus }) => {
  return (
    <div>
      <TextArea
        multiline
        autoFocus={autoFocus}
        label={label}
        onChange={(value) => onChange(value)}
        value={value || ''}
      />
    </div>
  );
};

const propertiesMapper = {
  input: Input,
  switch: PropertySwitch,
  select: PropertySelect,
  options: PropertyOptions,
  textarea: Textarea
};

export default propertiesMapper;
