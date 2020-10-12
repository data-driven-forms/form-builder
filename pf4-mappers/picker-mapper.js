import React from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { Button } from '@patternfly/react-core';

import './pf4-mapper-style.css';
import { builderComponentTypes } from '../src/constants';

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

const PickerRoot = ({ component }) => (
  <div className="pf4-picker-root">
    <Button tabIndex={-1} variant="primary" color="primary">
      {labels[component] || component}
    </Button>
  </div>
);

PickerRoot.propTypes = {
  component: PropTypes.string.isRequired,
};

const pickerMapper = {
  [builderComponentTypes.PICKER_FIELD]: PickerRoot,
};

export default pickerMapper;
