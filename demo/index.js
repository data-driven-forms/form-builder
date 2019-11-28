import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormBuilder from '../src/index';
import builderMapper from './builder-mapper';
import pickerMapper from './picker-mapper';

const componentProperties = {
  [componentTypes.TEXT_FIELD]: [{
    propertyName: 'label',
    label: 'Label',
    component: 'input',
  }, {
    propertyName: 'helperText',
    label: 'Helper text',
    component: 'input',
  }, {
    propertyName: 'placeholder',
    label: 'Placeholder',
    component: 'input',
  }, {
    label: 'Input Type',
    propertyName: 'type',
    options: ['text', 'number', 'password'],
  }, {
    propertyName: 'isDisabled',
    label: 'Disabled',
  }, {
    propertyName: 'isReadOnly',
    label: 'Read only',
  }],
};

const Demo = () => (
  <Fragment>
    <CssBaseline />
    <ThemeProvider theme={createMuiTheme({})}>
      <FormBuilder
        pickerMapper={pickerMapper}
        componentProperties={componentProperties}
        componentMapper={builderMapper}
      />
    </ThemeProvider>
  </Fragment>
);

ReactDom.render(<Demo />, document.getElementById('root'));
