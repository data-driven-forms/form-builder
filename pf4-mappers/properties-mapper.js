/* eslint react/no-array-index-key: "off" */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Button, FormGroup, TextArea, TextInput } from '@patternfly/react-core';
import { TrashIcon, PlusIcon, TrashRestoreIcon } from '@patternfly/react-icons';
import { InternalSelect } from '@data-driven-forms/pf4-component-mapper/select';

const FormGroupWrapper = ({ propertyValidation: { message }, children, ...props }) => (
  <FormGroup helperTextInvalid={message} validated={message ? 'error' : 'default'} {...props}>
    {children}
  </FormGroup>
);

FormGroupWrapper.propTypes = {
  propertyValidation: PropTypes.shape({ message: PropTypes.string }),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

FormGroupWrapper.defaultProps = {
  propertyValidation: {},
};

const Input = ({ label, value, fieldId, innerProps: { propertyValidation }, ...rest }) => {
  return (
    <Fragment>
      <FormGroupWrapper label={label} fieldId={fieldId} propertyValidation={propertyValidation}>
        <TextInput id={fieldId} value={typeof value === undefined ? '' : value.toString()} {...rest} />
      </FormGroupWrapper>
    </Fragment>
  );
};

Input.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string]).isRequired,
  value: PropTypes.any,
  fieldId: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    propertyValidation: PropTypes.shape({ message: PropTypes.string }),
  }).isRequired,
};

Input.defaultProps = {
  onChange: () => {},
  value: '',
};

const PropertySwitch = ({ value, fieldId, innerProps: { propertyValidation }, ...rest }) => (
  <FormGroupWrapper fieldId={fieldId} propertyValidation={propertyValidation}>
    <Switch isChecked={Boolean(value)} id={fieldId} {...rest} />
  </FormGroupWrapper>
);

PropertySwitch.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  fieldId: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    propertyValidation: PropTypes.shape({ message: PropTypes.string }),
  }).isRequired,
};

PropertySwitch.defaultProps = {
  value: false,
};

const PropertySelect = ({ label, options, fieldId, innerProps: { propertyValidation }, ...rest }) => (
  <FormGroupWrapper label={label} fieldId={fieldId} propertyValidation={propertyValidation}>
    <InternalSelect id={fieldId} options={options.map((option) => ({ value: option, label: option }))} {...rest} />
  </FormGroupWrapper>
);

PropertySelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  fieldId: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    propertyValidation: PropTypes.shape({ message: PropTypes.string }),
  }).isRequired,
};

PropertySelect.defaultProps = {
  onChange: () => {},
};

const PropertyOptions = ({ value = [], label, onChange, innerProps: { restricted } }) => {
  const handleOptionChange = (option, index, optionKey) =>
    onChange(value.map((item, itemIndex) => (index === itemIndex ? { ...item, [optionKey]: option } : item)));
  const handleRemove = (index, restoreable) => {
    let options;
    if (restoreable) {
      options = value.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              deleted: !item.deleted,
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
          alignItems: 'center',
        }}
      >
        <span>{label}</span>
        {!restricted && (
          <Button onClick={() => onChange([...value, { value: '', label: '' }])} variant="plain" aria-label="add option">
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
                  isDisabled={deleted || restricted}
                  onChange={(value) => handleOptionChange(value, index, 'value')}
                  value={value || ''}
                  type="text"
                />
              </td>
              <td>
                <Button onClick={() => handleRemove(index, restoreable)} variant="plain" aria-label="delete option">
                  {deleted ? <TrashRestoreIcon className="pf4-success-color" /> : <TrashIcon className="pf4-danger-color" />}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

PropertyOptions.propTypes = {
  value: PropTypes.array,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  innerProps: PropTypes.shape({ restricted: PropTypes.bool }).isRequired,
};

const Textarea = ({ value, fieldId, innerProps: { propertyValidation }, ...rest }) => {
  return (
    <FormGroupWrapper fieldId={fieldId} propertyValidation={propertyValidation}>
      <TextArea id={fieldId} value={typeof value === undefined ? '' : value} {...rest} />
    </FormGroupWrapper>
  );
};

Textarea.propTypes = {
  value: PropTypes.string,
  fieldId: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    propertyValidation: PropTypes.shape({ message: PropTypes.string }),
  }).isRequired,
};

Textarea.defaultProps = {
  onChange: () => {},
  value: '',
};

const propertiesMapper = {
  input: Input,
  switch: PropertySwitch,
  select: PropertySelect,
  options: PropertyOptions,
  textarea: Textarea,
};

export default propertiesMapper;
