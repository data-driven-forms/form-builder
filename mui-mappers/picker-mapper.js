import React from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    '& > *': {
      'margin-bottom': 8
    }
  },
  button: {
    pointerEvents: 'none'
  }
}));

const PickerRoot = ({ label }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button tabIndex={-1} className={classes.button} variant="outlined" color="primary" fullWidth>
        {label}
      </Button>
    </div>
  );
};

PickerRoot.propTypes = {
  label: PropTypes.string.isRequired
};

const TextFieldOption = () => <PickerRoot label="Text field" />;

const CheckboxOptions = () => <PickerRoot label="Checkbox" />;

const SelectOptions = () => <PickerRoot label="Select" />;

const DatePickerOption = () => <PickerRoot label="Date picker" />;

const PlainTextOption = () => <PickerRoot label="Plain text" />;

const RadioOption = () => <PickerRoot label="Radio" />;

const SwitchOption = () => <PickerRoot label="Switch" />;

const TextAreaOption = () => <PickerRoot label="Textarea" />;

const SubFormOption = () => <PickerRoot label="Sub form" />;

const pickerMapper = {
  [componentTypes.TEXT_FIELD]: TextFieldOption,
  [componentTypes.CHECKBOX]: CheckboxOptions,
  [componentTypes.SELECT]: SelectOptions,
  [componentTypes.DATE_PICKER]: DatePickerOption,
  [componentTypes.PLAIN_TEXT]: PlainTextOption,
  [componentTypes.RADIO]: RadioOption,
  [componentTypes.SWITCH]: SwitchOption,
  [componentTypes.TEXTAREA]: TextAreaOption,
  [componentTypes.SUB_FORM]: SubFormOption
};

export default pickerMapper;
