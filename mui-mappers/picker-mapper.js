import React from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { Button } from '@material-ui/core';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import TodayIcon from '@material-ui/icons/Today';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    '& > *': {
      'margin-bottom': 8
    }
  },
  label: {
    justifyContent: 'end'
  },
  buttonRoot: {
    pointerEvents: 'none',
    backgroundImage: 'linear-gradient(135deg, #41108E 0%, rgba(165, 37, 193, 1) 44.76%, #FC9957 100%)',
    backgroundRepeat: 'no-repeat'
  }
}));

const PickerRoot = ({ label, icon }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        startIcon={icon}
        tabIndex={-1}
        classes={{
          label: classes.label,
          root: classes.buttonRoot
        }}
        color="primary"
        fullWidth
      >
        {label}
      </Button>
    </div>
  );
};

PickerRoot.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node
};

const TextFieldOption = () => <PickerRoot icon={<TextFieldsIcon />} label="Text field" />;

const CheckboxOptions = () => <PickerRoot icon={<CheckBoxIcon />} label="Checkbox" />;

const SelectOptions = () => <PickerRoot icon={<FormatListBulletedIcon />} label="Select" />;

const DatePickerOption = () => <PickerRoot icon={<TodayIcon />} label="Date picker" />;

const PlainTextOption = () => <PickerRoot icon={<ChromeReaderModeIcon />} label="Plain text" />;

const RadioOption = () => <PickerRoot icon={<RadioButtonCheckedIcon />} label="Radio" />;

const SwitchOption = () => <PickerRoot icon={<ToggleOffIcon />} label="Switch" />;

const TextAreaOption = () => <PickerRoot icon={<TextFieldsIcon />} label="Textarea" />;

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
