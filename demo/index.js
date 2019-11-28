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
  LABEL, HELPER_TEXT, PLACEHOLDER, INPUT_TYPE, IS_DISABLED, IS_READ_ONLY, OPTIONS,
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
};

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
