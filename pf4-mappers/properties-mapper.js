/* eslint react/no-array-index-key: "off" */

import React from 'react';
import { Button, TextArea, TextInput, Switch } from '@patternfly/react-core';
import { CrossIcon, PlusIcon } from '@patternfly/react-icons';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper';

const Input = ({ label, onChange, value, autoFocus }) => {
  return (
    <div>
      <TextInput
        autoFocus={autoFocus}
        fullWidth
        label={label}
        onChange={(value) => onChange(value)}
        value={value || ''}
      />
    </div>
  );
};

const PropertySwitch = ({ value, onChange, label }) => {
  return (
    <div>
      <Switch
        checked={Boolean(value)}
        onChange={(checked) => onChange(checked)}
        label={label}
      />
      }
    </div>
  );
};

const PropertySelect = ({ value, label, onChange, options }) => {
  return (
    <div>
      <div>{label}</div>
      <rawComponents.Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value || ''}
        onChange={(value) => onChange(value)}
      />
    </div>
  );
};

const PropertyOptions = ({ value = [], label, onChange }) => {
  const handleOptionChange = (option, index, optionKey) =>
    onChange(
      value.map((item, itemIndex) =>
        index === itemIndex ? { ...item, [optionKey]: option } : item
      )
    );
  const handleRemove = (index) => {
    const options = value.filter((_item, itemIndex) => itemIndex !== index);
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
          variant="primary"
          aria-label="delete option"
        >
          <PlusIcon />
        </Button>
      </p>
      <table>
        {value.map(({ label, value }, index, allOptions) => (
          <tbody key={index}>
            <tr>
              <td>
                <TextInput
                  autoFocus
                  placeholder="Label"
                  onChange={(value) => handleOptionChange(value, index, 'label')}
                  value={label || ''}
                  type="text"
                />
              </td>
              <td>
                <TextInput
                  onKeyPress={({ key }) => {
                    if (key === 'Enter' && index === allOptions.length - 1) {
                      onChange([...allOptions, { value: '', label: '' }]);
                    }
                  }}
                  placeholder="Value"
                  onChange={(value) => handleOptionChange(value, index, 'value')}
                  value={value || ''}
                  type="text"
                />
              </td>
              <td>
                <Button
                  className={classes.danger}
                  onClick={() => handleRemove(index)}
                  color="secondary"
                  aria-label="delete option"
                  component="span"
                >
                  <CrossIcon />
                </Button>
              </td>
            </tr>
          </tbody>
        ))}
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
