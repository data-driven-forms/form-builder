import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import { componentTypes } from "@data-driven-forms/react-form-renderer";
import { formFieldsMapper } from "@data-driven-forms/mui-component-mapper";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";

const useTextFieldStyles = makeStyles(() => ({
  root: {
    position: "relative",
    width: "100%"
  }
}));

const TextField = ({ snapshot, ...props }) => {
  const classes = useTextFieldStyles();
  const Component = formFieldsMapper[componentTypes.TEXT_FIELD];
  return (
    <div className={classes.root}>
      <Component
        {...props}
        label={snapshot.isDragging ? "Text input" : props.label}
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
  return <Component {...props} label={props.label || "Please provide label"} />;
};

const SelectField = ({ preview, id, component, initialized, options, ...props }) => {
  const Component = formFieldsMapper[componentTypes.SELECT];
  return <Component {...props} options={options || []} />;
};

const useFieldActionsStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 16,
    heigh: 48,
    alignSelf: "center"
  },
  editButton: {
    "&:hover": {
      color: theme.palette.primary.main
    }
  },
  deleteButton: {
    "&:hover": {
      color: theme.palette.error.main
    }
  }
}));

const FieldActions = ({ onSelect, onDelete, fieldData }) => {
  const classes = useFieldActionsStyles();
  return (
    <Box className={classes.root} display='flex'>
      <IconButton className={classes.editButton} onClick={onSelect}>
        <EditIcon />
      </IconButton>
      <IconButton className={classes.deleteButton} onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

const FieldLayout = ({ children }) => (
  <Box
    display='flex'
    flexDirection='row'
    justifyContent='space-between'
    style={{ padding: 8 }}
  >
    {children}
  </Box>
);

const useBuilderStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 24px)"
  }
}));

const BuilderColumn = ({ children, ...props }) => {
  const classes = useBuilderStyles();
  return (
    <Card {...props}>
      <CardContent className={classes.root}>{children}</CardContent>
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
        label={label || "Please provide a label to plain text component"}
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
      label={snapshot.isDragging ? "Switch field" : props.label}
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
    <Component {...props} label={snapshot.isDragging ? "Texarea" : props.label} />
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
  BuilderColumn
};

export default builderMapper;
