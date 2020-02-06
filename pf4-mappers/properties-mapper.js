/* eslint react/no-array-index-key: "off" */

import React, { Fragment } from 'react';
import { Switch } from '@patternfly/react-core/dist/js/components/Switch/Switch';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form/FormGroup';
import { TextArea } from '@patternfly/react-core/dist/js/components/TextArea/TextArea';
import { TextInput } from '@patternfly/react-core/dist/js/components/TextInput/TextInput';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';
import PlusIcon from '@patternfly/react-icons/dist/js/icons/plus-icon';
import TrashRestoreIcon from '@patternfly/react-icons/dist/js/icons/trash-restore-icon';
import { rawComponents } from '@data-driven-forms/pf4-component-mapper';

const FormGroupWrapper = ({
  propertyValidation: { message },
  children,
  ...props
}) => (
  <FormGroup helperTextInvalid={message} isValid={!message} {...props}>
    {children}
  </FormGroup>
);

FormGroupWrapper.defaultProps = {
  propertyValidation: {}
};

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
  propertyValidation,
  ...rest
}) => {
  return (
    <Fragment>
      <FormGroupWrapper
        label={label}
        fieldId={label}
        propertyValidation={propertyValidation}
      >
        <TextInput
          id={label}
          type={type}
          autoFocus={autoFocus}
          onChange={(value) => onChange(value)}
          value={value || ''}
          isDisabled={isDisabled}
          {...rest}
        />
      </FormGroupWrapper>
    </Fragment>
  );
};

const PropertySwitch = ({
  value,
  onChange,
  label,
  isDisabled,
  propertyValidation
}) => (
  <FormGroupWrapper fieldId={label} propertyValidation={propertyValidation}>
    <Switch
      isChecked={Boolean(value)}
      id={`${label}-property`}
      onChange={(checked) => onChange(checked)}
      label={label}
      isDisabled={isDisabled}
    />
  </FormGroupWrapper>
);

const PropertySelect = ({ value, label, onChange, options, propertyValidation }) => {
  return (
    <FormGroupWrapper
      label={label}
      fieldId={label}
      propertyValidation={propertyValidation}
    >
      <rawComponents.Select
        id={label}
        value={value || ''}
        options={options.map((option) => ({ value: option, label: option }))}
        onChange={(value) => onChange(value)}
      />
    </FormGroupWrapper>
  );
};

const PropertyOptions = ({ value = [], label, onChange, restricted, ...rest }) => {
  console.log('property options res: ', rest);
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
        {!restricted && (
          <Button
            onClick={() => onChange([...value, { value: '', label: '' }])}
            variant="plain"
            aria-label="add option"
          >
            <PlusIcon />
          </Button>
        )}
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

const Textarea = ({ label, onChange, value, autoFocus, propertyValidation }) => {
  return (
    <FormGroupWrapper fieldId={label} propertyValidation={propertyValidation}>
      <TextArea
        multiline
        autoFocus={autoFocus}
        label={label}
        onChange={(value) => onChange(value)}
        value={value || ''}
      />
    </FormGroupWrapper>
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
