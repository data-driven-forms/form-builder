import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import {
  formFieldsMapper,
  rawComponents
} from '@data-driven-forms/pf4-component-mapper';

import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { Card } from '@patternfly/react-core/dist/js/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/js/components/Card/CardBody';
import { CardHeader } from '@patternfly/react-core/dist/js/components/Card/CardHeader';
import { Form } from '@patternfly/react-core/dist/js/components/Form/Form';
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form/FormGroup';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';
import { Tab } from '@patternfly/react-core/dist/js/components/Tabs/Tab';
import { Tabs } from '@patternfly/react-core/dist/js/components/Tabs/Tabs';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';
import TimesIcon from '@patternfly/react-icons/dist/js/icons/times-icon';
import GripVerticalIcon from '@patternfly/react-icons/dist/js/icons/grip-vertical-icon';
import EyeSlashIcon from '@patternfly/react-icons/dist/js/icons/eye-slash-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
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

const ComponentWrapper = ({ hideField, children }) => (
  <div
    className={clsx('pf4-component-wrapper', {
      hidden: hideField
    })}
  >
    <div className="pf4-hidefield-overlay">
      <EyeSlashIcon size="xl" className="hide-indicator" />
      {children}
    </div>
  </div>
);

ComponentWrapper.propTypes = {
  children: childrenPropType,
  hideField: PropTypes.bool
};

const TextField = ({
  snapshot,
  preview,
  initialized,
  restricted,
  propertyName,
  fieldId,
  hideField,
  propertyValidation,
  hasPropertyError,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.TEXT_FIELD];
  return (
    <ComponentWrapper hideField={hideField}>
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
  hideField,
  propertyValidation,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.CHECKBOX];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component {...props} label={props.label || 'Please provide label'} />
    </ComponentWrapper>
  );
};

CheckBoxField.propTypes = {
  ...commonPropTypes
};

const SelectField = ({
  preview,
  component,
  initialized,
  options,
  hideField,
  propertyValidation,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.SELECT];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component
        {...props}
        options={options && options.filter(({ deleted }) => !deleted)}
      />
    </ComponentWrapper>
  );
};

SelectField.propTypes = {
  ...commonPropTypes,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.any, label: PropTypes.string })
  )
};

const FieldLayout = ({ children, disableDrag }) => (
  <div
    className={clsx('pf4-field-layout', {
      'drag-disabled': disableDrag
    })}
  >
    {children}
  </div>
);

FieldLayout.propTypes = {
  children: childrenPropType,
  disableDrag: PropTypes.bool
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

const DatePickerField = ({
  preview,
  id,
  component,
  initialized,
  hideField,
  propertyValidation,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.DATE_PICKER];
  return (
    <ComponentWrapper hideField={hideField}>
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
  hideField,
  propertyValidation,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.PLAIN_TEXT];
  return (
    <ComponentWrapper hideField={hideField}>
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

const RadioField = ({
  preview,
  id,
  component,
  initialized,
  hideField,
  propertyValidation,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.RADIO];
  if (!props.options) {
    return <p>Radio field does not have any options.</p>;
  }
  return (
    <ComponentWrapper hideField={hideField}>
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
  hideField,
  propertyValidation,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.SWITCH];
  return (
    <ComponentWrapper hideField={hideField}>
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
  hideField,
  propertyValidation,
  ...props
}) => {
  const Component = formFieldsMapper[componentTypes.TEXTAREA];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component {...props} label={snapshot.isDragging ? 'Texarea' : props.label} />
    </ComponentWrapper>
  );
};

TextAreaField.propTypes = {
  ...commonPropTypes
};

const SubFormField = ({
  title,
  description,
  formOptions,
  hideField,
  propertyValidation
}) => {
  const Component = formFieldsMapper[componentTypes.SUB_FORM];
  return (
    <ComponentWrapper hideField={hideField}>
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
  addValidator,
  avaiableValidators,
  handleClose,
  handleDelete,
  hasPropertyError
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const Select = rawComponents.Select;
  return (
    <div className="pf4-properties-editor-container">
      <Card className="pf4-properties-editor-header">
        <CardBody>
          <Title
            headingLevel="h2"
            size="2xl"
            className="pf4-properties-editor-title"
          >
            Properties editor
            {handleDelete && (
              <Button
                className="editor-header-button"
                variant="plain"
                onClick={handleDelete}
                isDisabled={!handleDelete}
                aria-label="delete field"
              >
                <TrashIcon />
              </Button>
            )}
            <Button
              className="editor-header-button"
              variant="plain"
              aria-label="close properties editor"
              onClick={handleClose}
            >
              <TimesIcon />
            </Button>
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
            <Tab
              tabIndex="-1"
              eventKey={0}
              title={
                <span>
                  Properties{' '}
                  {hasPropertyError && (
                    <ExclamationCircleIcon className="pf4-property-error-icon" />
                  )}
                </span>
              }
            />
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
        <Card className="pf4-validators-property-group">
          <CardBody>
            <Form>
              <FormGroup label="Add validator" fieldId="new-validator">
                <Select
                  id="new-validator"
                  placeholder="Choose new validator"
                  onChange={(value) => addValidator(value)}
                  options={avaiableValidators}
                />
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
        {validationChildren}
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
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func
};

SubFormField.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  formOptions: PropTypes.object
};

const PropertyGroup = ({ className, children, title, handleDelete, ...props }) => (
  <Card className="pf4-validators-property-group">
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

const DragHandle = ({ dragHandleProps, hasPropertyError }) => (
  <div {...dragHandleProps} className="pf4-drag-handle">
    {hasPropertyError && (
      <ExclamationCircleIcon className="pf4-property-error-icon icon-spacer-bottom" />
    )}
    <GripVerticalIcon className="pf4-drag-handle-icon" />
  </div>
);

DragHandle.propTypes = {
  dragHandleProps: PropTypes.shape({
    'data-rbd-drag-handle-draggable-id': PropTypes.string.isRequired,
    'data-rbd-drag-handle-context-id': PropTypes.string.isRequired,
    'aria-labelledby': PropTypes.string,
    tabIndex: PropTypes.number,
    draggable: PropTypes.bool,
    onDragStart: PropTypes.func.isRequired
  }),
  hasPropertyError: PropTypes.bool
};

const FormContainer = ({ children, className }) => (
  <div className={clsx(className, 'pf-c-form', 'pf4-builder-form-container')}>
    {children}
  </div>
);

FormContainer.propTypes = {
  children: childrenPropType,
  className: PropTypes.string
};

const builderMapper = {
  FieldLayout,
  PropertiesEditor,
  FormContainer,
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
  PropertyGroup,
  DragHandle
};

export default builderMapper;
