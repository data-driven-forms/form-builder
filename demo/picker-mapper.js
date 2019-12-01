import React from 'react';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { makeStyles } from '@material-ui/core/styles';

const useTextFieldStyles = makeStyles(() => ({
  root: {
    cursor: 'pointer',
    padding: 4,
    '&:hover>button': {
      backgroundColor: '#303f9f',
    },
  },
  button: {
    pointerEvents: 'none',
  },
}));

const TextFieldOption = () => {
  const classes = useTextFieldStyles();
  return (
    <div className={classes.root}>
      <Button
        tabIndex="-1"
        className={clsx(classes.button)}
        fullWidth
        variant="contained"
        color="primary"
      >
        Text field
      </Button>
    </div>
  );
};

const CheckboxOptions = () => {
  const classes = useTextFieldStyles();
  return (
    <div className={classes.root}>
      <Button
        tabIndex="-1"
        className={clsx(classes.button)}
        fullWidth
        variant="contained"
        color="primary"
      >
        Checkbox
      </Button>
    </div>
  );
};

const SelectOptions = () => {
  const classes = useTextFieldStyles();
  return (
    <div className={classes.root}>
      <Button
        tabIndex="-1"
        className={clsx(classes.button)}
        fullWidth
        variant="contained"
        color="primary"
      >
        Select
      </Button>
    </div>
  );
};

const DatePickerOption = () => {
  const classes = useTextFieldStyles();
  return (
    <div className={classes.root}>
      <Button
        tabIndex="-1"
        className={clsx(classes.button)}
        fullWidth
        variant="contained"
        color="primary"
      >
        Date picker
      </Button>
    </div>
  );
};

const PlainTextOption = () => {
  const classes = useTextFieldStyles();
  return (
    <div className={classes.root}>
      <Button
        tabIndex="-1"
        className={clsx(classes.button)}
        fullWidth
        variant="contained"
        color="primary"
      >
        Plain text
      </Button>
    </div>
  );
};

const RadioOption = () => {
  const classes = useTextFieldStyles();
  return (
    <div className={classes.root}>
      <Button
        tabIndex="-1"
        className={clsx(classes.button)}
        fullWidth
        variant="contained"
        color="primary"
      >
        Radio
      </Button>
    </div>
  );
};

const SwitchOption = () => {
  const classes = useTextFieldStyles();
  return (
    <div className={classes.root}>
      <Button
        tabIndex="-1"
        className={clsx(classes.button)}
        fullWidth
        variant="contained"
        color="primary"
      >
        Switch
      </Button>
    </div>
  );
};

const TextAreaOption = () => {
  const classes = useTextFieldStyles();
  return (
    <div className={classes.root}>
      <Button
        tabIndex="-1"
        className={clsx(classes.button)}
        fullWidth
        variant="contained"
        color="primary"
      >
        TextArea
      </Button>
    </div>
  );
};


const pickerMapper = {
  [componentTypes.TEXT_FIELD]: TextFieldOption,
  [componentTypes.CHECKBOX]: CheckboxOptions,
  [componentTypes.SELECT]: SelectOptions,
  [componentTypes.DATE_PICKER]: DatePickerOption,
  [componentTypes.PLAIN_TEXT]: PlainTextOption,
  [componentTypes.RADIO]: RadioOption,
  [componentTypes.SWITCH]: SwitchOption,
  [componentTypes.TEXTAREA]: TextAreaOption,
};

export default pickerMapper;
