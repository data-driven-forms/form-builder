import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { componentMapper } from '@data-driven-forms/mui-component-mapper';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

import {
  Card,
  CardContent,
  MenuItem,
  TextField as TextFieldMUI,
  Tabs,
  Tab,
  CardHeader,
  Typography,
  Divider,
  Box,
  Badge,
  IconButton
} from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import ErrorIcon from '@material-ui/icons/Error';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';

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

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'grid',
    'grid-gap': 16
  },
  formContainer: {
    'flex-grow': 1,
    padding: 16,
    backgroundColor: 'transparent',
    transitionProperty: 'background-color',
    transitionDuration: theme.transitions.duration.standard,
    transitionTimingFunction: theme.transitions.easing.easeInOut
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
    display: 'flex',
    flexGrow: 1,
    padding: 8
  },
  tabs: {
    marginBottom: 8
  },
  badge: {
    width: '100%'
  },
  handle: {
    background: grey[300],
    textAlign: 'right',
    padding: 2,
    lineHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    '&:hover svg:last-child': {
      fill: theme.palette.primary.main
    }
  },
  warning: {
    fill: red[500]
  },
  fieldLayout: {
    paddingBottom: 8,
    cursor: 'pointer',
    position: 'relative',
    '&:after': {
      display: 'block',
      content: '""',
      position: 'absolute',
      bottom: 8,
      top: 0,
      left: 0,
      right: 0,
      borderBottomStyle: 'solid',
      borderBottomWidth: 3,
      borderBottomColor: theme.palette.primary.main,
      transform: 'scaleX(0)',
      transitionProperty: 'transform',
      transitionDuration: theme.transitions.duration.standard,
      transitionTimingFunction: theme.transitions.easing.easeInOut
    }
  },
  fieldLayoutDragging: {
    '& .mui-builder-drag-handle-icon': {
      fill: theme.palette.primary.main
    }
  },
  fieldLayoutSelected: {
    '&:after': {
      pointerEvents: 'none',
      transform: 'scaleX(1)'
    }
  },
  fieldContent: {
    padding: 0,
    paddingBottom: 0
  },
  fieldCard: {
    overflow: 'unset',
    paddingBottom: 0,
    display: 'flex'
  },
  builderColumn: {
    margin: 16
  },
  componentWrapperOverlay: {
    '&:after': {
      pointerEvents: 'none',
      zIndex: 0,
      display: 'block',
      content: '""',
      position: 'absolute',
      transitionProperty: 'all',
      transitionDuration: theme.transitions.duration.standard,
      transitionTimingFunction: theme.transitions.easing.easeInOut,
      opacity: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  },
  componentWrapperHidden: {
    pointerEvents: 'none',
    '&:after': {
      background: grey[200],
      opacity: 0.8
    }
  },
  hiddenIconIndicator: {
    zIndex: 1,
    position: 'absolute',
    left: '50%',
    fontSize: '3rem',
    top: 'calc(50% - 3rem / 2)',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: theme.transitions.duration.standard,
    transitionTimingFunction: theme.transitions.easing.easeInOut
  },
  showHiddenIndicator: {
    opacity: 1
  },
  emptyTarget: {
    height: '100%'
  },
  formContainerOver: {
    backgroundColor: blue[100]
  }
}));

const ComponentWrapper = ({ hideField, children }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.componentWrapper, classes.componentWrapperOverlay, {
        [classes.componentWrapperHidden]: hideField
      })}
    >
      <VisibilityOffIcon
        className={clsx(classes.hiddenIconIndicator, {
          [classes.showHiddenIndicator]: hideField
        })}
      />
      {children}
    </div>
  );
};

ComponentWrapper.propTypes = {
  children: childrenPropType,
  hideField: PropTypes.bool
};

const TextField = ({ innerProps: { snapshot, hideField }, propertyName, fieldId, propertyValidation, hasPropertyError, ...props }) => {
  const Component = componentMapper[componentTypes.TEXT_FIELD];
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
  const Component = componentMapper[componentTypes.CHECKBOX];
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
  const Component = componentMapper[componentTypes.SELECT];
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

const FieldLayout = ({ children, disableDrag, dragging, selected }) => {
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.fieldLayout, {
        [classes.fieldLayoutDragging]: dragging,
        [classes.fieldLayoutSelected]: selected,
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
  disableDrag: PropTypes.bool,
  dragging: PropTypes.bool,
  selected: PropTypes.bool
};

const BuilderColumn = ({ children, isDraggingOver, ...props }) => {
  const classes = useStyles();
  return (
    <div {...props} className={classes.builderColumn}>
      {children}
    </div>
  );
};

BuilderColumn.propTypes = {
  className: PropTypes.string,
  children: childrenPropType,
  isDraggingOver: PropTypes.bool
};

const DatePickerField = ({ innerProps: { hideField }, propertyValidation, ...props }) => {
  const Component = componentMapper[componentTypes.DATE_PICKER];
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
  const Component = componentMapper[componentTypes.PLAIN_TEXT];
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
  const Component = componentMapper[componentTypes.RADIO];
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

const SwitchField = ({ innerProps: { hideField }, propertyValidation, component, ...props }) => {
  const Component = componentMapper[componentTypes.SWITCH];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component {...props} label={props.label} />
    </ComponentWrapper>
  );
};

SwitchField.propTypes = {
  ...commonPropTypes
};

const TextAreaField = ({ innerProps: { snapshot, hideField }, propertyValidation, hasPropertyError, ...props }) => {
  const Component = componentMapper[componentTypes.TEXTAREA];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component {...props} label={snapshot.isDragging ? 'Texarea' : props.label} />
    </ComponentWrapper>
  );
};

TextAreaField.propTypes = {
  ...commonPropTypes
};

const SubFormField = ({ title, description, innerProps: { hideField } }) => {
  const Component = componentMapper[componentTypes.SUB_FORM];
  return (
    <ComponentWrapper hideField={hideField}>
      <Component fields={[]} title={title || 'Subform'} description={description} />
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
        <Tabs
          indicatorColor="primary"
          className={classes.tabs}
          variant="fullWidth"
          value={activeTab}
          onChange={(_e, tabIndex) => setActiveTab(tabIndex)}
        >
          <Tab
            label={
              <Badge color="default" badgeContent={hasPropertyError && <ErrorIcon className={classes.warning} />}>
                Properties
              </Badge>
            }
          />
          <Tab label="Validation" />
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
  description: PropTypes.string
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
      {!disableDrag && <DragIndicatorIcon className="mui-builder-drag-handle-icon" />}
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

const FormContainer = ({ children, isDraggingOver }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.formContainer, {
        [classes.formContainerOver]: isDraggingOver
      })}
    >
      {children}
    </div>
  );
};

const EmptyTarget = () => {
  const classes = useStyles();
  return (
    <Box className={classes.emptyTarget} display="flex" alignItems="center">
      <ArrowBackIcon fontSize="large" />
    </Box>
  );
};

FormContainer.propTypes = {
  children: childrenPropType,
  className: PropTypes.string,
  isDraggingOver: PropTypes.bool
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
  DragHandle,
  EmptyTarget
};

export default builderMapper;
