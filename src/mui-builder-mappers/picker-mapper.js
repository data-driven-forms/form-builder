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
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import TuneIcon from '@material-ui/icons/Tune';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    '& > *': {
      'margin-bottom': 8,
    },
  },
  label: {
    justifyContent: 'end',
  },
  buttonRoot: {
    pointerEvents: 'none',
    backgroundImage: 'linear-gradient(135deg, #41108E 0%, rgba(165, 37, 193, 1) 44.76%, #FC9957 100%)',
    backgroundRepeat: 'no-repeat',
  },
}));

const labels = {
  [componentTypes.TEXT_FIELD]: 'Text field',
  [componentTypes.CHECKBOX]: 'Checkbox',
  [componentTypes.SELECT]: 'Select',
  [componentTypes.DATE_PICKER]: 'Date picker',
  [componentTypes.PLAIN_TEXT]: 'Plain text',
  [componentTypes.RADIO]: 'Radio',
  [componentTypes.SWITCH]: 'Switch',
  [componentTypes.TEXTAREA]: 'Textarea',
  [componentTypes.SUB_FORM]: 'Sub form',
  [componentTypes.DUAL_LIST_SELECT]: 'Dual list select',
  [componentTypes.SLIDER]: 'Slider',
};

const icons = {
  [componentTypes.TEXT_FIELD]: <TextFieldsIcon />,
  [componentTypes.CHECKBOX]: <CheckBoxIcon />,
  [componentTypes.SELECT]: <FormatListBulletedIcon />,
  [componentTypes.DATE_PICKER]: <TodayIcon />,
  [componentTypes.DUAL_LIST_SELECT]: <LowPriorityIcon />,
  [componentTypes.PLAIN_TEXT]: <ChromeReaderModeIcon />,
  [componentTypes.RADIO]: <RadioButtonCheckedIcon />,
  [componentTypes.SWITCH]: <ToggleOffIcon />,
  [componentTypes.TEXTAREA]: <TextFieldsIcon />,
  [componentTypes.SUB_FORM]: null,
  [componentTypes.SLIDER]: <TuneIcon />,
};

const PickerRoot = ({ component }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        startIcon={icons[component]}
        tabIndex={-1}
        classes={{
          label: classes.label,
          root: classes.buttonRoot,
        }}
        color="primary"
        fullWidth
      >
        {labels[component] || component}
      </Button>
    </div>
  );
};

PickerRoot.propTypes = {
  component: PropTypes.string.isRequired,
};

const pickerMapper = Object.values(componentTypes).reduce(
  (acc, value) => ({
    ...acc,
    [value]: (props) => <PickerRoot component={value} {...props} />,
  }),
  {}
);

export default pickerMapper;
