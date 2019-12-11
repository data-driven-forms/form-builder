import React from 'react';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';
import { Button, Card, CardBody } from '@patternfly/react-core';
import { TractorIcon, EditIcon } from '@patternfly/react-icons';

console.log(formFieldsMapper)

const TextField = ({ snapshot, ...props }) => {
  const Component = formFieldsMapper[componentTypes.TEXT_FIELD];
  return (
    <div>
      <Component
        {...props}
        label={snapshot.isDragging ? 'Text input' : props.label}
      />
    </div>
  );
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
  return <Component {...props} label={props.label || 'Please provide label'} />;
};

const SelectField = ({ preview, id, component, initialized, options, ...props }) => {
  const Component = formFieldsMapper[componentTypes.SELECT];
  return <Component {...props} options={options || []} />;
};

const FieldActions = ({ onSelect, onDelete, fieldData }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Button onClick={onSelect}>
        <EditIcon />
      </Button>
      <Button onClick={onDelete}>
        <TractorIcon />
      </Button>
    </div>
  );
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

const BuilderColumn = ({ children, ...props }) => {
  return (
    <Card {...props}>
      <CardBody>{children}</CardBody>
    </Card>
  );
};

const DatePickerField = ({ preview, id, component, initialized, ...props }) => {
  const Component = formFieldsMapper[componentTypes.DATE_PICKER];
  return <Component {...props} />;
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
    <div>
      <Component
        {...props}
        label={label || 'Please provide a label to plain text component'}
      />
    </div>
  );
};

const RadioField = ({ preview, id, component, initialized, ...props }) => {
  const Component = formFieldsMapper[componentTypes.RADIO];
  if (!props.options) {
    return <p>Radio field does not have any options.</p>;
  }
  return <Component {...props} input={{ ...props.input, onChange: console.log }} />;
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
    <Component
      {...props}
      label={snapshot.isDragging ? 'Switch field' : props.label}
    />
  );
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
    <Component {...props} label={snapshot.isDragging ? 'Texarea' : props.label} />
  );
};

const SubFormField = ({ title, description, formOptions }) => {
  const Component = formFieldsMapper[componentTypes.SUB_FORM];
  return (
    <Component
      fields={[]}
      title={title || 'Subform'}
      description={description}
      formOptions={formOptions}
    />
  );
};

const builderMapper = {
  FieldActions,
  FieldLayout,
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
