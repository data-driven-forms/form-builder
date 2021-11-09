import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';

import clsx from 'clsx';

import { styled } from '@mui/material/styles';

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
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { builderComponentTypes } from '../constants';

import { grey, red, blue } from '@mui/material/colors';

const snapshotPropType = PropTypes.shape({ isDragging: PropTypes.bool }).isRequired;
const childrenPropType = PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]);

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

const StyledComponentWrapper = styled('div')(({ theme }) => ({
  '&.componentWrapper': {
    position: 'relative',
    display: 'flex',
    flexGrow: 1,
    padding: 8,
  },
  '&.componentWrapperOverlay': {
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
  '&.componentWrapperHidden': {
    pointerEvents: 'none',
    '&:after': {
      background: grey[200],
      opacity: 0.8,
    },
  },
  '& .hiddenIconIndicator': {
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
  '& .showHiddenIndicator': {
    opacity: 1,
  },
}));

const ComponentWrapper = ({
  innerProps: { hideField, snapshot },
  Component,
  propertyName,
  fieldId,
  propertyValidation,
  hasPropertyError,
  ...props
}) => (
  <StyledComponentWrapper
    className={clsx('componentWrapper', 'componentWrapperOverlay', {
      componentWrapperHidden: hideField,
    })}
  >
    <VisibilityOffIcon
      className={clsx('hiddenIconIndicator', {
        showHiddenIndicator: hideField,
      })}
    />
    <Component
      {...props}
      label={props.label || prepareLabel(props.component, snapshot.isDragging)}
      {...prepareOptions(props.component, props.options)}
    />
  </StyledComponentWrapper>
);

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

const StyledFieldLayout = styled('div')(({ theme }) => ({
  '&.fieldLayout': {
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
  '&.fieldLayoutDragging': {
    '& .mui-builder-drag-handle-icon': {
      fill: theme.palette.primary.main,
    },
  },
  '&.fieldLayoutSelected': {
    '&:after': {
      pointerEvents: 'none',
      transform: 'scaleX(1)',
    },
  },
  '& .fieldCard': {
    overflow: 'unset',
    paddingBottom: 0,
    display: 'flex',
  },
}));

const FieldLayout = ({ children, disableDrag, dragging, selected }) => (
  <StyledFieldLayout
    className={clsx('fieldLayout', {
      fieldLayoutDragging: dragging,
      fieldLayoutSelected: selected,
      'drag-disabled': disableDrag,
    })}
  >
    <Card square className="fieldCard">
      {children}
    </Card>
  </StyledFieldLayout>
);

FieldLayout.propTypes = {
  children: childrenPropType,
  disableDrag: PropTypes.bool,
  dragging: PropTypes.bool,
  selected: PropTypes.bool,
};

const StyledBuilderColumn = styled('div')(() => ({
  '&.builderColumn': {
    margin: 16,
  },
}));

const BuilderColumn = ({ children, isDraggingOver, ...props }) => (
  <StyledBuilderColumn {...props} className="builderColumn">
    {children}
  </StyledBuilderColumn>
);

BuilderColumn.propTypes = {
  className: PropTypes.string,
  children: childrenPropType,
  isDraggingOver: PropTypes.bool,
};

const StyledPropertiesEditor = styled(Card)(() => ({
  '&.propertiesContainer': {
    'padding-left': 8,
    'flex-grow': '1',
    'max-width': '30%',
    width: '30%',
    minHeight: '100vh',
  },
  '& .tabs': {
    marginBottom: 8,
  },
  '& .warning': {
    fill: red[500],
  },
  '& .form': {
    display: 'grid',
    'grid-gap': 16,
  },
}));

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

  useEffect(() => {
    if (activeTab === 1 && disableValidators) {
      setActiveTab(0);
    }
  }, [disableValidators]);

  return (
    <StyledPropertiesEditor className="propertiesContainer">
      <CardContent>
        <CardHeader
          title="Properties editor"
          action={
            <React.Fragment>
              {handleDelete && (
                <IconButton onClick={handleDelete} aria-label="delete field" size="large">
                  <DeleteIcon className="warning" />
                </IconButton>
              )}
              <IconButton aria-label="close properties editor" onClick={handleClose} size="large">
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          }
        >
          Properties editor
        </CardHeader>
        <Tabs indicatorColor="primary" className="tabs" variant="fullWidth" value={activeTab} onChange={(_e, tabIndex) => setActiveTab(tabIndex)}>
          <Tab
            label={
              <Badge color="default" badgeContent={hasPropertyError && <ErrorIcon className="warning" />}>
                Properties
              </Badge>
            }
          />
          {!disableValidators && <Tab label="Validation" />}
        </Tabs>
        <div hidden={activeTab !== 0}>
          <form className="form">{propertiesChildren}</form>
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
          <form className="form">{validationChildren}</form>
        </div>
      </CardContent>
    </StyledPropertiesEditor>
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

const StyledPropertyGroup = styled('div')(() => ({
  '& .form': {
    display: 'grid',
    'grid-gap': 16,
  },
  '& .warning': {
    fill: red[500],
  },
}));

const PropertyGroup = ({ className, children, title, handleDelete, ...props }) => (
  <StyledPropertyGroup>
    <Divider />
    <Typography variant="h6" gutterBottom>
      {title}
      {handleDelete && (
        <IconButton variant="plain" onClick={handleDelete} size="large">
          <DeleteIcon className="warning" />
        </IconButton>
      )}
    </Typography>
    <div className="form" {...props}>
      {children}
    </div>
  </StyledPropertyGroup>
);

PropertyGroup.propTypes = {
  className: PropTypes.string,
  children: childrenPropType,
  title: PropTypes.string.isRequired,
  handleDelete: PropTypes.func,
};

const StyledDragHandle = styled('div')(({ theme }) => ({
  '&.handle': {
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
  '& .warning': {
    fill: red[500],
  },
}));

const DragHandle = ({ dragHandleProps, hasPropertyError, disableDrag }) => {
  if (disableDrag && !hasPropertyError) {
    return null;
  }

  return (
    <StyledDragHandle {...dragHandleProps} className="handle">
      {hasPropertyError && <ErrorIcon className="warning" />}
      {!disableDrag && <DragIndicatorIcon className="mui-builder-drag-handle-icon" />}
    </StyledDragHandle>
  );
};

DragHandle.propTypes = {
  dragHandleProps: PropTypes.shape({
    'data-rbd-drag-handle-draggable-id': PropTypes.string.isRequired,
    'data-rbd-drag-handle-context-id': PropTypes.string.isRequired,
    'aria-labelledby': PropTypes.string,
    tabIndex: PropTypes.number,
    draggable: PropTypes.bool,
    onDragStart: PropTypes.func.isRequired,
  }),
  disableDrag: PropTypes.bool,
  hasPropertyError: PropTypes.bool,
};

const StyledFormContainerDiv = styled('div')(({ theme }) => ({
  '&.formContainer': {
    'flex-grow': '1',
    padding: 16,
    backgroundColor: 'transparent',
    transitionProperty: 'background-color',
    transitionDuration: theme.transitions.duration.standard,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  '&.formContainerOver': {
    backgroundColor: blue[100],
  },
}));

const FormContainer = ({ children, isDraggingOver }) => (
  <StyledFormContainerDiv
    className={clsx('formContainer', {
      formContainerOver: isDraggingOver,
    })}
  >
    {children}
  </StyledFormContainerDiv>
);

const StyledBox = styled(Box)(() => ({
  '&.emptyTarget': {
    height: '100%',
  },
}));

const EmptyTarget = () => (
  <StyledBox className="emptyTarget" display="flex" alignItems="center">
    <ArrowBackIcon fontSize="large" />
  </StyledBox>
);

FormContainer.propTypes = {
  children: childrenPropType,
  className: PropTypes.string,
  isDraggingOver: PropTypes.bool,
};

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
