import React from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';
import { Button, Card, CardBody, Form, Title } from '@patternfly/react-core';
import { TrashIcon, EditIcon } from '@patternfly/react-icons';

const snapshotPropType = PropTypes.shape({ isDragging: PropTypes.bool }).isRequired;
const childrenPropType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.arrayOf(PropTypes.node)
]);

const commonPropTypes = {
  component: PropTypes.string,
  snapshot: snapshotPropType,
  label: PropTypes.string,
  preview: PropTypes.bool,
  id: PropTypes.string,
  initialized: PropTypes.bool
};

const ComponentWrapper = ({ children }) => (
  <div className="pf4-component-wrapper">{children}</div>
);

ComponentWrapper.propTypes = {
  children: childrenPropType
};

const TextField = ({ snapshot, preview, initialized, ...props }) => {
  const Component = formFieldsMapper[componentTypes.TEXT_FIELD];
  return (
    <ComponentWrapper>
      <Component
        {...props}
        label={snapshot.isDragging ? props.label || 'Text input' : props.label}
      />
    </ComponentWrapper>
  );
};

TextField.propTypes = {
  ...commonPropTypes
};

const CheckBoxField = ({
  preview,
  id,
  component,
  initialized,
  snapshot,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.CHECKBOX];
  return (
    <ComponentWrapper>
      <Component {...props} label={props.label || 'Please provide label'} />
    </ComponentWrapper>
  );
};

CheckBoxField.propTypes = {
  ...commonPropTypes
};

const SelectField = ({ preview, id, component, initialized, options, ...props }) => {
  const Component = formFieldsMapper[componentTypes.SELECT];
  return (
    <ComponentWrapper>
      <Component {...props} options={options || []} />
    </ComponentWrapper>
  );
};

SelectField.propTypes = {
  ...commonPropTypes,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.any, label: PropTypes.string })
  )
};

const FieldActions = ({ onSelect, onDelete }) => {
  return (
    <div className="pf4-field-actions" style={{ display: 'flex' }}>
      <Button onClick={onSelect}>
        <EditIcon />
      </Button>
      <Button onClick={onDelete}>
        <TrashIcon />
      </Button>
    </div>
  );
};

FieldActions.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

const FieldLayout = ({ children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 8
    }}
  >
    {children}
  </div>
);

FieldLayout.propTypes = {
  children: childrenPropType
};

const BuilderColumn = ({ children, ...props }) => {
  return (
    <Card {...props} className="pf4-builder-column">
      <CardBody>{children}</CardBody>
    </Card>
  );
};

BuilderColumn.propTypes = {
  children: childrenPropType
};

const DatePickerField = ({ preview, id, component, initialized, ...props }) => {
  const Component = formFieldsMapper[componentTypes.DATE_PICKER];
  return (
    <ComponentWrapper>
      <Component {...props} />
    </ComponentWrapper>
  );
};

DatePickerField.propTypes = {
  ...commonPropTypes
};

const PlainTextField = ({
  preview,
  id,
  component,
  initialized,
  label,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.PLAIN_TEXT];
  return (
    <ComponentWrapper>
      <Component
        {...props}
        label={label || 'Please provide a label to plain text component'}
      />
    </ComponentWrapper>
  );
};

PlainTextField.propTypes = {
  ...commonPropTypes
};

const RadioField = ({ preview, id, component, initialized, ...props }) => {
  const Component = formFieldsMapper[componentTypes.RADIO];
  if (!props.options) {
    return <p>Radio field does not have any options.</p>;
  }
  return (
    <ComponentWrapper>
      <Component {...props} input={{ ...props.input, onChange: console.log }} />
    </ComponentWrapper>
  );
};

RadioField.propTypes = {
  ...commonPropTypes,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.any })
  )
};

const SwitchField = ({
  preview,
  id,
  component,
  initialized,
  snapshot,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.SWITCH];
  return (
    <ComponentWrapper>
      <Component
        {...props}
        label={snapshot.isDragging ? 'Switch field' : props.label}
      />
    </ComponentWrapper>
  );
};

SwitchField.propTypes = {
  ...commonPropTypes
};

const TextAreaField = ({
  preview,
  id,
  component,
  initialized,
  snapshot,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.TEXTAREA];
  return (
    <ComponentWrapper>
      <Component {...props} label={snapshot.isDragging ? 'Texarea' : props.label} />
    </ComponentWrapper>
  );
};

TextAreaField.propTypes = {
  ...commonPropTypes
};

const SubFormField = ({ title, description, formOptions }) => {
  const Component = formFieldsMapper[componentTypes.SUB_FORM];
  return (
    <ComponentWrapper>
      <Component
        fields={[]}
        title={title || 'Subform'}
        description={description}
        formOptions={formOptions}
      />
    </ComponentWrapper>
  );
};

const PropertiesEditor = ({ propertiesChildren, fieldName }) => (
  <div>
    <Title headingLevel="h2" size="2xl">
      Properties editor
    </Title>
    <Title headingLevel="h3" size="1xl">
      Field: {fieldName}
    </Title>
    <Form>{propertiesChildren}</Form>
  </div>
);

PropertiesEditor.propTypes = {
  propertiesChildren: childrenPropType,
  fieldName: PropTypes.string
};

SubFormField.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  formOptions: PropTypes.object
};

const builderMapper = {
  FieldActions,
  FieldLayout,
  PropertiesEditor,
  [componentTypes.TEXT_FIELD]: TextField,
  [componentTypes.CHECKBOX]: CheckBoxField,
  [componentTypes.SELECT]: SelectField,
  [componentTypes.PLAIN_TEXT]: PlainTextField,
  [componentTypes.DATE_PICKER]: DatePickerField,
  [componentTypes.RADIO]: RadioField,
  [componentTypes.SWITCH]: SwitchField,
  [componentTypes.TEXTAREA]: TextAreaField,
  [componentTypes.SUB_FORM]: SubFormField,
  BuilderColumn
};

export default builderMapper;
