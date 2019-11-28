import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormBuilder from '../src/index';
import builderMapper from './builder-mapper';
import pickerMapper from './picker-mapper';
import propertiesMapper from './properties-mapper';

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
    component: 'select',
  }, {
    propertyName: 'isDisabled',
    label: 'Disabled',
    component: 'switch',
  }, {
    propertyName: 'isReadOnly',
    label: 'Read only',
    component: 'switch',
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
        propertiesMapper={propertiesMapper}
      />
    </ThemeProvider>
  </Fragment>
);

ReactDom.render(<Demo />, document.getElementById('root'));
