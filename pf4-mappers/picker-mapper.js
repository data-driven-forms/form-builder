import React from 'react';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { Button } from '@patternfly/react-core';

const TextFieldOption = () => {
  return (
    <div>
      <Button tabIndex={-1} fullWidth variant="primary" color="primary">
        Text field
      </Button>
    </div>
  );
};

const CheckboxOptions = () => {
  return (
    <div>
      <Button tabIndex={-1} fullWidth variant="primary" color="primary">
        Checkbox
      </Button>
    </div>
  );
};

const SelectOptions = () => {
  return (
    <div>
      <Button tabIndex={-1} fullWidth variant="primary" color="primary">
        Select
      </Button>
    </div>
  );
};

const DatePickerOption = () => {
  return (
    <div>
      <Button tabIndex={-1} fullWidth variant="primary" color="primary">
        Date picker
      </Button>
    </div>
  );
};

const PlainTextOption = () => {
  return (
    <div>
      <Button tabIndex={-1} fullWidth variant="primary" color="primary">
        Plain text
      </Button>
    </div>
  );
};

const RadioOption = () => {
  return (
    <div>
      <Button tabIndex={-1} fullWidth variant="primary" color="primary">
        Radio
      </Button>
    </div>
  );
};

const SwitchOption = () => {
  return (
    <div>
      <Button tabIndex={-1} fullWidth variant="primary" color="primary">
        Switch
      </Button>
    </div>
  );
};

const TextAreaOption = () => {
  return (
    <div>
      <Button tabIndex={-1} fullWidth variant="primary" color="primary">
        TextArea
      </Button>
    </div>
  );
};

const SubFormOption = () => {
  return (
    <div>
      <Button tabIndex={-1} fullWidth variant="primary" color="secondary">
        Sub form
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
  [componentTypes.SUB_FORM]: SubFormOption
};

export default pickerMapper;
