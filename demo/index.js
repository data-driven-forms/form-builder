import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormBuilder from '../src/index';
import builderMapper from './builder-mapper';
import pickerMapper from './picker-mapper';
import propertiesMapper from './properties-mapper';
import {
  LABEL,
  HELPER_TEXT,
  PLACEHOLDER,
  INPUT_TYPE,
  IS_DISABLED,
  IS_READ_ONLY,
  OPTIONS,
  TODAY_BUTTON_LABEL,
  IS_CLEARABLE,
  CLOSE_ON_DAY_SELECT,
  SHOW_TODAY_BUTTON,
  MULTI_LINE_LABEL,
} from './field-properties';

const componentProperties = {
  [componentTypes.TEXT_FIELD]: [
    LABEL,
    HELPER_TEXT,
    PLACEHOLDER,
    INPUT_TYPE,
    IS_DISABLED,
    IS_READ_ONLY,
  ],
  [componentTypes.CHECKBOX]: [
    LABEL,
    IS_DISABLED,
    OPTIONS,
  ],
  [componentTypes.SELECT]: [
    OPTIONS,
    LABEL,
    IS_DISABLED,
    PLACEHOLDER,
    HELPER_TEXT,
  ],
  [componentTypes.DATE_PICKER]: [
    LABEL,
    TODAY_BUTTON_LABEL,
    IS_CLEARABLE,
    CLOSE_ON_DAY_SELECT,
    SHOW_TODAY_BUTTON,
  ],
  [componentTypes.PLAIN_TEXT]: [
    MULTI_LINE_LABEL,
  ],
  [componentTypes.RADIO]: [
    LABEL,
    IS_DISABLED,
    OPTIONS,
  ],
  [componentTypes.SWITCH]: [
    LABEL,
    IS_READ_ONLY,
    IS_DISABLED,
  ],
  [componentTypes.TEXTAREA]: [
    LABEL,
    HELPER_TEXT,
    IS_READ_ONLY,
    IS_DISABLED,
  ],
};

console.log(componentProperties, pickerMapper);

const Demo = () => (
  <Fragment>
    <CssBaseline />
    <ThemeProvider theme={createMuiTheme({})}>
      <FormBuilder
        pickerMapper={pickerMapper}
        componentProperties={componentProperties}
        componentMapper={builderMapper}
        propertiesMapper={propertiesMapper}
      />
    </ThemeProvider>
  </Fragment>
);

ReactDom.render(<Demo />, document.getElementById('root'));
