import React from 'react';
import PropTypes from 'prop-types';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { Button } from '@patternfly/react-core';

import './pf4-mapper-style.css';

const PickerRoot = ({ label }) => (
  <div className="pf4-picker-root">
    <Button tabIndex={-1} variant="primary" color="primary">
      {label}
    </Button>
  </div>
);

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

const DualListSelectOption = () => <PickerRoot label="Dual list select" />;

const SliderOption = () => <PickerRoot label="Slider" />;

const pickerMapper = {
  [componentTypes.TEXT_FIELD]: TextFieldOption,
  [componentTypes.CHECKBOX]: CheckboxOptions,
  [componentTypes.SELECT]: SelectOptions,
  [componentTypes.DATE_PICKER]: DatePickerOption,
  [componentTypes.PLAIN_TEXT]: PlainTextOption,
  [componentTypes.RADIO]: RadioOption,
  [componentTypes.SWITCH]: SwitchOption,
  [componentTypes.TEXTAREA]: TextAreaOption,
  [componentTypes.SUB_FORM]: SubFormOption,
  [componentTypes.DUAL_LIST_SELECT]: DualListSelectOption,
  [componentTypes.SLIDER]: SliderOption
};

export default pickerMapper;
