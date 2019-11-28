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

const pickerMapper = {
  [componentTypes.TEXT_FIELD]: TextFieldOption,
  [componentTypes.CHECKBOX]: CheckboxOptions,
};

export default pickerMapper;
