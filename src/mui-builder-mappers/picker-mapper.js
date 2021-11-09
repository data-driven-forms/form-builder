import React from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { Button } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TodayIcon from '@mui/icons-material/Today';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import TuneIcon from '@mui/icons-material/Tune';
import { styled } from '@mui/material/styles';
import { builderComponentTypes } from '../constants';

const Root = styled('div')(() => ({
  '&.root': {
    '& > *': {
      'margin-bottom': 8,
    },
  },
  '& .label': {
    justifyContent: 'end',
  },
  '& .buttonRoot': {
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

const PickerRoot = ({ component }) => (
  <Root className="root">
    <Button
      variant="contained"
      startIcon={icons[component]}
      tabIndex={-1}
      classes={{
        label: 'label',
        root: 'buttonRoot',
      }}
      color="primary"
      fullWidth
    >
      {labels[component] || component}
    </Button>
  </Root>
);

PickerRoot.propTypes = {
  component: PropTypes.string.isRequired,
};

const pickerMapper = {
  [builderComponentTypes.PICKER_FIELD]: PickerRoot,
};

export default pickerMapper;
