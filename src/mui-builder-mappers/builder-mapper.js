import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';

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
  IconButton,
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
import { builderComponentTypes } from '../constants';

const snapshotPropType = PropTypes.shape({ isDragging: PropTypes.bool }).isRequired;
const childrenPropType = PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]);

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'grid',
    'grid-gap': 16,
  },
  formContainer: {
    'flex-grow': 1,
    padding: 16,
    backgroundColor: 'transparent',
    transitionProperty: 'background-color',
    transitionDuration: theme.transitions.duration.standard,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  propertiesContainer: {
    'padding-left': 8,
    'flex-grow': 1,
    'max-width': '30%',
    width: '30%',
    minHeight: '100vh',
  },
  componentWrapper: {
    position: 'relative',
    display: 'flex',
    flexGrow: 1,
    padding: 8,
  },
  tabs: {
    marginBottom: 8,
  },
  badge: {
    width: '100%',
  },
  handle: {
    background: grey[300],
    textAlign: 'right',
    padding: 2,
    lineHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    '&:hover svg:last-child': {
      fill: theme.palette.primary.main,
    },
  },
  warning: {
    fill: red[500],
  },
  containerLayout: {},
  containerLayoutCard: {
    display: 'flex',
    '& > div:first-child': {
      flexGrow: 1,
    },
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
      transitionTimingFunction: theme.transitions.easing.easeInOut,
    },
  },
  fieldLayoutDragging: {
    '& .mui-builder-drag-handle-icon': {
      fill: theme.palette.primary.main,
    },
  },
  fieldLayoutSelected: {
    '&:after': {
      pointerEvents: 'none',
      transform: 'scaleX(1)',
    },
  },
  fieldContent: {
    padding: 0,
    paddingBottom: 0,
  },
  fieldCard: {
    overflow: 'unset',
    paddingBottom: 0,
    display: 'flex',
  },
  builderColumn: {
    margin: 16,
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
      bottom: 0,
    },
  },
  componentWrapperHidden: {
    pointerEvents: 'none',
    '&:after': {
      background: grey[200],
      opacity: 0.8,
    },
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
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  showHiddenIndicator: {
    opacity: 1,
  },
  emptyTarget: {
    height: '100%',
  },
  formContainerOver: {
    backgroundColor: blue[100],
  },
}));

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
}) => {
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.componentWrapper, classes.componentWrapperOverlay, {
        [classes.componentWrapperHidden]: hideField,
      })}
    >
      <VisibilityOffIcon
        className={clsx(classes.hiddenIconIndicator, {
          [classes.showHiddenIndicator]: hideField,
        })}
      />
      <Component
        {...props}
        label={props.label || prepareLabel(props.component, snapshot.isDragging)}
        {...prepareOptions(props.component, props.options)}
      />
    </div>
  );
};

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

const FieldLayout = ({ children, disableDrag, dragging, selected }) => {
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.fieldLayout, {
        [classes.fieldLayoutDragging]: dragging,
        [classes.fieldLayoutSelected]: selected,
        'drag-disabled': disableDrag,
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
  selected: PropTypes.bool,
};

const ContainerLayout = ({ children, disableDrag, dragging, selected }) => {
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.containerLayout, {
        [classes.fieldLayoutSelected]: selected,
      })}
    >
      <Card className={classes.containerLayoutCard} square>
        {children}
      </Card>
    </div>
  );
};

ContainerLayout.propTypes = {
  children: childrenPropType,
  disableDrag: PropTypes.bool,
  dragging: PropTypes.bool,
  selected: PropTypes.bool,
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
  const classes = useStyles();

  useEffect(() => {
    if (activeTab === 1 && disableValidators) {
      setActiveTab(0);
    }
  }, [disableValidators]);

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
          {!disableValidators && <Tab label="Validation" />}
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
  hasPropertyError: PropTypes.array,
  disableValidators: PropTypes.bool,
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
  handleDelete: PropTypes.func,
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
  dragHandleProps: PropTypes.object.isRequired,
  disableDrag: PropTypes.bool,
  hasPropertyError: PropTypes.bool,
};

const FormContainer = ({ children, isDraggingOver }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.formContainer, {
        [classes.formContainerOver]: isDraggingOver,
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
  isDraggingOver: PropTypes.bool,
};

const builderMapper = {
  FieldLayout,
  ContainerLayout,
  PropertiesEditor,
  FormContainer,
  [builderComponentTypes.BUILDER_FIELD]: ComponentWrapper,
  BuilderColumn,
  PropertyGroup,
  DragHandle,
  EmptyTarget,
};

export default builderMapper;
