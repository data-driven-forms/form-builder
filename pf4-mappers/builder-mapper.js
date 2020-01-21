import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import {
  formFieldsMapper,
  rawComponents
} from '@data-driven-forms/pf4-component-mapper';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Title,
  Tabs,
  Tab,
  CardHeader
} from '@patternfly/react-core';
import { TrashIcon, EditIcon, TimesIcon } from '@patternfly/react-icons';
import clsx from 'clsx';

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

const SelectField = ({
  preview,
  id,
  component,
  initialized,
  options,
  input,
  isMulti,
  multi,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.SELECT];
  let sanitizedInput = { ...input };
  if ((isMulti || multi) && !Array.isArray(input.value)) {
    sanitizedInput.value = [];
  }
  return (
    <ComponentWrapper>
      <Component {...props} input={sanitizedInput} options={options || []} />
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
      {onDelete && (
        <Button onClick={onDelete}>
          <TrashIcon />
        </Button>
      )}
    </div>
  );
};

FieldActions.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func
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

const BuilderColumn = ({ children, className, ...props }) => {
  return (
    <Card {...props} className={clsx('pf4-builder-column', className)}>
      <CardBody className="pf-c-form">{children}</CardBody>
    </Card>
  );
};

BuilderColumn.propTypes = {
  className: PropTypes.string,
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

const PropertiesEditor = ({
  propertiesChildren,
  validationChildren,
  fieldName,
  addValidator,
  avaiableValidators,
  handleClose
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const Select = rawComponents.Select;
  return (
    <div>
      <Card className="pf4-properties-editor-header">
        <CardBody>
          <Title
            headingLevel="h2"
            size="2xl"
            className="pf4-properties-editor-title"
          >
            Properties editor
            <Button
              className="close-button"
              variant="plain"
              aria-label="close properties editor"
              onClick={handleClose}
            >
              <TimesIcon />
            </Button>
          </Title>
          <Title headingLevel="h3" size="1xl">
            Field: {fieldName}
          </Title>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="pf4-tabs-container">
          <Tabs
            className="pf4-tabs"
            isFilled
            activeKey={activeTab}
            onSelect={(_e, tabIndex) => setActiveTab(tabIndex)}
          >
            <Tab tabIndex="-1" eventKey={0} title="Props" />
            <Tab tabIndex="-1" eventKey={1} title="Validation" />
          </Tabs>
        </CardBody>
      </Card>
      <div hidden={activeTab !== 0}>
        <Card>
          <CardBody>
            <Form>{propertiesChildren}</Form>
          </CardBody>
        </Card>
      </div>
      <div hidden={activeTab !== 1}>
        <Form>
          <Card>
            <CardBody>
              <FormGroup label="Add validator" fieldId="new-validator">
                <Select
                  id="new-validator"
                  placeholder="Choose new validator"
                  onChange={(value) => addValidator(value)}
                  options={avaiableValidators}
                />
              </FormGroup>
            </CardBody>
          </Card>
          {validationChildren}
        </Form>
      </div>
    </div>
  );
};

PropertiesEditor.propTypes = {
  propertiesChildren: childrenPropType,
  validationChildren: childrenPropType,
  avaiableValidators: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ).isRequired,
  addValidator: PropTypes.func.isRequired,
  fieldName: PropTypes.string,
  handleClose: PropTypes.func.isRequired
};

SubFormField.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  formOptions: PropTypes.object
};

const PropertyGroup = ({ className, children, title, handleDelete, ...props }) => (
  <Card>
    <CardHeader>
      <Title headingLevel="h3" size="1xl" className="pf4-validators-validator-title">
        {title}
        {handleDelete && (
          <Button variant="plain" onClick={handleDelete}>
            <TrashIcon />
          </Button>
        )}
      </Title>
    </CardHeader>
    <CardBody>
      <Form className={clsx(className, 'pf4')} {...props}>
        {children}
      </Form>
    </CardBody>
  </Card>
);

PropertyGroup.propTypes = {
  className: PropTypes.string,
  children: childrenPropType,
  title: PropTypes.string.isRequired,
  handleDelete: PropTypes.func
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
  BuilderColumn,
  PropertyGroup
};

export default builderMapper;
