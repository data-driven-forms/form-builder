import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { formFieldsMapper } from '@data-driven-forms/mui-component-mapper';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import TextFieldMUI from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CardHeader from '@material-ui/core/CardHeader';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ErrorIcon from '@material-ui/icons/Error';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Badge from '@material-ui/core/Badge';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const snapshotPropType = PropTypes.shape({ isDragging: PropTypes.bool }).isRequired;
const childrenPropType = PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]);

const commonPropTypes = {
  component: PropTypes.string,
  innerProps: PropTypes.shape({
    snapshot: snapshotPropType
  }).isRequired,
  label: PropTypes.string,
  preview: PropTypes.bool,
  id: PropTypes.string,
  initialized: PropTypes.bool
};

const useStyles = makeStyles(() => ({
  form: {
    display: 'grid',
    'grid-gap': 16
  },
  formContainer: {
    'flex-grow': 1,
    padding: 16
  },
  propertiesContainer: {
    'padding-left': 8,
    'flex-grow': 1,
    'max-width': '30%',
    width: '30%',
    height: '100vh'
  },
  componentWrapper: {
    position: 'relative',
    display: 'flex'
  },
  tabs: {
    marginBottom: 8
  },
  badge: {
    width: '100%'
  },
  handle: {
    background: grey[200],
    'text-align': 'right',
    padding: 2,
    lineHeight: 0,
    width: 'calc(100% + 16px)',
    position: 'relative',
    left: -8
  },
  warning: {
    fill: red[500]
  },
  fieldLayout: {
    paddingBottom: 8,
    cursor: 'pointer',
    position: 'relative'
  },
  fieldContent: {
    padding: 0,
    paddingBottom: 0
  },
  fieldCard: {
    overflow: 'unset',
    padding: 8,
    paddingBottom: 0
  }
}));

const ComponentWrapper = ({ hideField, children }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.componentWrapper}>
        {hideField ? (
          <Badge
            color="default"
            className={classes.badge}
            badgeContent={<VisibilityOffIcon color="primary" aria-label="hidden" titleAccess="hidden field" />}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            {children}
          </Badge>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

ComponentWrapper.propTypes = {
  children: childrenPropType,
  hideField: PropTypes.bool
};

const TextField = ({ innerProps: { snapshot, hideField }, propertyName, fieldId, propertyValidation, hasPropertyError, ...props }) => {
  const Component = formFieldsMapper[componentTypes.TEXT_FIELD];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component {...props} label={snapshot.isDragging ? props.label || 'Text input' : props.label} />
    </ComponentWrapper>
  );
};

TextField.propTypes = {
  ...commonPropTypes
};

const CheckBoxField = ({ innerProps: { hideField }, id, propertyValidation, ...props }) => {
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

const SelectField = ({ innerProps: { hideField }, options = [], propertyValidation, ...props }) => {
  const Component = formFieldsMapper[componentTypes.SELECT];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component {...props} options={options && options.filter(({ deleted }) => !deleted)} />
    </ComponentWrapper>
  );
};

SelectField.propTypes = {
  ...commonPropTypes,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.any, label: PropTypes.string }))
};

SelectField.defaultProps = {
  onChange: () => {}
};

const FieldLayout = ({ children, disableDrag }) => {
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.fieldLayout, {
        'drag-disabled': disableDrag
      })}
    >
      <Card square className={classes.fieldCard}>
        {children}
      </Card>
    </div>
  );
};

FieldLayout.propTypes = {
  children: childrenPropType,
  disableDrag: PropTypes.bool
};

const BuilderColumn = ({ children, isDraggingOver, ...props }) => (
  <Card {...props} raised>
    <CardContent>{children}</CardContent>
  </Card>
);

BuilderColumn.propTypes = {
  className: PropTypes.string,
  children: childrenPropType,
  isDraggingOver: PropTypes.bool
};

const DatePickerField = ({ innerProps: { hideField }, propertyValidation, ...props }) => {
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

const PlainTextField = ({ innerProps: { hideField }, label, propertyValidation, ...props }) => {
  const Component = formFieldsMapper[componentTypes.PLAIN_TEXT];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component {...props} label={label || 'Please provide a label to plain text component'} />
    </ComponentWrapper>
  );
};

PlainTextField.propTypes = {
  ...commonPropTypes
};

const RadioField = ({ innerProps: { hideField }, propertyValidation, innerProps, ...props }) => {
  const Component = formFieldsMapper[componentTypes.RADIO];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component {...props} />
    </ComponentWrapper>
  );
};

RadioField.propTypes = {
  ...commonPropTypes,
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.any }))
};

RadioField.defaultProps = {
  options: [],
  label: 'Please pick label and options'
};

const SwitchField = ({ innerProps: { snapshot, hideField }, propertyValidation, ...props }) => {
  const Component = formFieldsMapper[componentTypes.SWITCH];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component {...props} label={snapshot.isDragging ? 'Switch field' : props.label} />
    </ComponentWrapper>
  );
};

SwitchField.propTypes = {
  ...commonPropTypes
};

const TextAreaField = ({ innerProps: { snapshot, hideField }, propertyValidation, hasPropertyError, ...props }) => {
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

const SubFormField = ({ title, description, formOptions, innerProps: { hideField } }) => {
  const Component = formFieldsMapper[componentTypes.SUB_FORM];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component fields={[]} title={title || 'Subform'} description={description} formOptions={formOptions} />
    </ComponentWrapper>
  );
};

SubFormField.propTypes = {
  innerProps: PropTypes.shape({ hideField: PropTypes.bool }).isRequired
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
  const classes = useStyles();

  return (
    <Card className={classes.propertiesContainer}>
      <CardContent>
        <CardHeader
          title="Properties editor"
          action={
            <React.Fragment>
              {handleDelete && (
                <IconButton onClick={handleDelete} aria-label="delete field">
                  <DeleteIcon className={classes.warning} />
                </IconButton>
              )}
              <IconButton aria-label="close properties editor" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          }
        >
          Properties editor
        </CardHeader>
        <Tabs className={classes.tabs} variant="fullWidth" value={activeTab} onChange={(_e, tabIndex) => setActiveTab(tabIndex)}>
          <Tab
            tabIndex="-1"
            label={
              <Badge color="default" badgeContent={hasPropertyError && <ErrorIcon className={classes.warning} />}>
                Properties
              </Badge>
            }
          />
          <Tab tabIndex="-1" label="Validation" />
        </Tabs>
        <div hidden={activeTab !== 0}>
          <form className={classes.form}>{propertiesChildren}</form>
        </div>
        <div hidden={activeTab !== 1}>
          <TextFieldMUI
            select
            id="new-validator"
            onChange={(e) => addValidator(e.target.value)}
            label="Add validator"
            placeholder="Choose new validator"
            fullWidth
            value=""
          >
            {avaiableValidators.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextFieldMUI>
          <form className={classes.form}>{validationChildren}</form>
        </div>
      </CardContent>
    </Card>
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
  hasPropertyError: PropTypes.array
};

SubFormField.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  formOptions: PropTypes.object
};

const PropertyGroup = ({ className, children, title, handleDelete, ...props }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Divider />
      <Typography variant="h6" gutterBottom>
        {title}
        {handleDelete && (
          <IconButton variant="plain" onClick={handleDelete}>
            <DeleteIcon className={classes.warning} />
          </IconButton>
        )}
      </Typography>
      <div className={classes.form} {...props}>
        {children}
      </div>
    </React.Fragment>
  );
};

PropertyGroup.propTypes = {
  className: PropTypes.string,
  children: childrenPropType,
  title: PropTypes.string.isRequired,
  handleDelete: PropTypes.func
};

const DragHandle = ({ dragHandleProps, hasPropertyError, disableDrag }) => {
  const classes = useStyles();

  if (disableDrag && !hasPropertyError) {
    return null;
  }

  return (
    <div {...dragHandleProps} className={classes.handle}>
      {hasPropertyError && <ErrorIcon className={classes.warning} />}
      {!disableDrag && <DragHandleIcon />}
    </div>
  );
};

DragHandle.propTypes = {
  dragHandleProps: PropTypes.shape({
    'data-rbd-drag-handle-draggable-id': PropTypes.string.isRequired,
    'data-rbd-drag-handle-context-id': PropTypes.string.isRequired,
    'aria-labelledby': PropTypes.string,
    tabIndex: PropTypes.number,
    draggable: PropTypes.bool,
    onDragStart: PropTypes.func.isRequired
  }),
  disableDrag: PropTypes.bool,
  hasPropertyError: PropTypes.bool
};

const FormContainer = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.formContainer}>{children}</div>;
};

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
