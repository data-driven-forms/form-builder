import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';

import { Button, Card, CardBody, CardHeader, Form, FormGroup, Title, Tab, Tabs } from '@patternfly/react-core';
import { TrashIcon, TimesIcon, GripVerticalIcon, EyeSlashIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import clsx from 'clsx';
import { InternalSelect } from '@data-driven-forms/pf4-component-mapper/select';
import { builderComponentTypes } from '../constants';

const prepareLabel = (component, isDragging) =>
  ({
    [componentTypes.CHECKBOX]: 'Please, provide label',
    [componentTypes.PLAIN_TEXT]: 'Please provide a label to plain text component',
    [componentTypes.DUAL_LIST_SELECT]: 'Please pick label and options',
    [componentTypes.RADIO]: 'Please pick label and options',
  }[component] || (isDragging ? component : ''));

const prepareOptions = (component, options = []) =>
  ({
    [componentTypes.SELECT]: { options: options.filter(({ deleted }) => !deleted) },
    [componentTypes.DUAL_LIST_SELECT]: { options },
    [componentTypes.RADIO]: { options },
  }[component] || {});

const ComponentWrapper = ({
  innerProps: { hideField, snapshot },
  Component,
  propertyName,
  fieldId,
  propertyValidation,
  hasPropertyError,
  ...props
}) => (
  <div
    className={clsx('pf4-component-wrapper', {
      hidden: hideField,
    })}
  >
    <div className="pf4-hidefield-overlay">
      <EyeSlashIcon size="xl" className="hide-indicator" />
      <Component
        {...props}
        label={props.label || prepareLabel(props.component, snapshot.isDragging)}
        {...prepareOptions(props.component, props.options)}
      />
    </div>
  </div>
);

const snapshotPropType = PropTypes.shape({ isDragging: PropTypes.bool }).isRequired;
const childrenPropType = PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]);

ComponentWrapper.propTypes = {
  Component: PropTypes.elementType,
  component: PropTypes.string,
  innerProps: PropTypes.shape({
    snapshot: snapshotPropType,
    hideField: PropTypes.bool,
  }).isRequired,
  label: PropTypes.string,
  preview: PropTypes.bool,
  id: PropTypes.string,
  initialized: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.any, label: PropTypes.string })),
  propertyName: PropTypes.string,
  fieldId: PropTypes.string,
  propertyValidation: PropTypes.any,
  hasPropertyError: PropTypes.bool,
};

const FieldLayout = ({ children, disableDrag, selected }) => (
  <div style={{ paddingBottom: 8 }}>
    <div
      className={clsx('pf4-field-layout', {
        'drag-disabled': disableDrag,
        selected,
      })}
    >
      {children}
    </div>
  </div>
);

FieldLayout.propTypes = {
  children: childrenPropType,
  disableDrag: PropTypes.bool,
  selected: PropTypes.bool,
};

const BuilderColumn = ({ children, isDraggingOver, ...props }) => (
  <Card {...props} className={'pf4-builder-column'}>
    <CardBody className="pf-c-form">{children}</CardBody>
  </Card>
);

BuilderColumn.propTypes = {
  className: PropTypes.string,
  children: childrenPropType,
  isDraggingOver: PropTypes.bool,
};

const PropertiesEditor = ({
  propertiesChildren,
  validationChildren,
  addValidator,
  avaiableValidators,
  handleClose,
  handleDelete,
  hasPropertyError,
  disableValidators,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const Select = InternalSelect;

  useEffect(() => {
    if (activeTab === 1 && disableValidators) {
      setActiveTab(0);
    }
  }, [disableValidators]);

  return (
    <div className="pf4-properties-editor-container">
      <Card className="pf4-properties-editor-header">
        <CardBody>
          <Title headingLevel="h2" size="2xl" className="pf4-properties-editor-title">
            Properties editor
            {handleDelete && (
              <Button className="editor-header-button" variant="plain" onClick={handleDelete} isDisabled={!handleDelete} aria-label="delete field">
                <TrashIcon />
              </Button>
            )}
            <Button className="editor-header-button" variant="plain" aria-label="close properties editor" onClick={handleClose}>
              <TimesIcon />
            </Button>
          </Title>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="pf4-tabs-container">
          <Tabs className="pf4-tabs" isFilled activeKey={activeTab} onSelect={(_e, tabIndex) => setActiveTab(tabIndex)}>
            <Tab
              tabIndex="-1"
              eventKey={0}
              title={<span>Properties {hasPropertyError && <ExclamationCircleIcon className="pf4-property-error-icon" />}</span>}
            />
            {!disableValidators && <Tab tabIndex="-1" eventKey={1} title="Validation" disabled={disableValidators} />}
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
  avaiableValidators: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })).isRequired,
  addValidator: PropTypes.func.isRequired,
  fieldName: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func,
  hasPropertyError: PropTypes.array,
  disableValidators: PropTypes.bool,
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
  handleDelete: PropTypes.func,
};

const DragHandle = ({ dragHandleProps, hasPropertyError, disableDrag }) => {
  if (disableDrag && !hasPropertyError) {
    return null;
  }
  return (
    <div {...dragHandleProps} className="pf4-drag-handle">
      {hasPropertyError && <ExclamationCircleIcon className="pf4-property-error-icon icon-spacer-bottom" />}
      {!disableDrag && <GripVerticalIcon className="pf4-drag-handle-icon" />}
    </div>
  );
};

DragHandle.propTypes = {
  dragHandleProps: PropTypes.shape({
    'data-rbd-drag-handle-draggable-id': PropTypes.string,
    'data-rbd-drag-handle-context-id': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    tabIndex: PropTypes.number,
    draggable: PropTypes.bool,
    onDragStart: PropTypes.func,
  }),
  disableDrag: PropTypes.bool,
  hasPropertyError: PropTypes.bool,
};

const FormContainer = ({ children, className }) => <div className={clsx(className, 'pf-c-form', 'pf4-builder-form-container')}>{children}</div>;

FormContainer.propTypes = {
  children: childrenPropType,
  className: PropTypes.string,
};

const EmptyTarget = () => <h1>Pick components from the component picker</h1>;

const builderMapper = {
  FieldLayout,
  PropertiesEditor,
  FormContainer,
  [builderComponentTypes.BUILDER_FIELD]: ComponentWrapper,
  BuilderColumn,
  PropertyGroup,
  DragHandle,
  EmptyTarget,
};

export default builderMapper;
