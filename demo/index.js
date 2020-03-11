import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormBuilder from '../src/index';

import { pickerMapper, propertiesMapper, builderMapper, BuilderTemplate } from '../mui-mappers';
// import { pickerMapper, propertiesMapper, builderMapper, BuilderTemplate } from '../pf4-mappers';

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
  TITLE,
  DESCRIPTION,
  HIDE_FIELD
} from './field-properties';

const componentProperties = {
  [componentTypes.TEXT_FIELD]: {
    attributes: [LABEL, HELPER_TEXT, PLACEHOLDER, INPUT_TYPE, IS_DISABLED, IS_READ_ONLY, HIDE_FIELD]
  },
  [componentTypes.CHECKBOX]: {
    attributes: [LABEL, IS_DISABLED, OPTIONS, HIDE_FIELD]
  },
  [componentTypes.SELECT]: {
    attributes: [LABEL, OPTIONS, IS_DISABLED, PLACEHOLDER, HELPER_TEXT, HIDE_FIELD]
  },
  [componentTypes.DATE_PICKER]: {
    attributes: [LABEL, TODAY_BUTTON_LABEL, IS_CLEARABLE, CLOSE_ON_DAY_SELECT, SHOW_TODAY_BUTTON, HIDE_FIELD]
  },
  [componentTypes.PLAIN_TEXT]: { attributes: [MULTI_LINE_LABEL] },
  [componentTypes.RADIO]: { attributes: [LABEL, IS_DISABLED, OPTIONS, HIDE_FIELD] },
  [componentTypes.SWITCH]: {
    attributes: [LABEL, IS_READ_ONLY, IS_DISABLED, HIDE_FIELD]
  },
  [componentTypes.TEXTAREA]: {
    attributes: [LABEL, HELPER_TEXT, IS_READ_ONLY, IS_DISABLED, HIDE_FIELD]
  },
  [componentTypes.SUB_FORM]: {
    isContainer: true,
    attributes: [TITLE, DESCRIPTION]
  }
};

const schema = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'my-text-field',
      label: 'Something',
      initialValue: 'Foo',
      isRequired: true,
      hideField: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'This field is required'
        },
        {
          type: validatorTypes.MIN_LENGTH,
          threshold: 7
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 10
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'my-number-field',
      label: 'Number field',
      validate: [
        {
          type: validatorTypes.MAX_NUMBER_VALUE,
          value: 33
        },
        {
          type: validatorTypes.MIN_NUMBER_VALUE,
          value: 14
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'pattern-field',
      label: 'Pattern field',
      validate: [
        {
          type: validatorTypes.PATTERN_VALIDATOR,
          pattern: /^Foo$/
        }
      ]
    },
    {
      component: componentTypes.SELECT,
      label: 'Select',
      name: 'select',
      initialValue: '2',
      options: [
        {
          label: 'Option 1',
          value: '1'
        },
        {
          label: 'Option 2',
          value: '2'
        }
      ]
    }
  ]
};

const schemaTemplate = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'my-text-field',
      label: 'Something',
      isRequired: true,
      initialValue: 'Foo',
      validate: [
        {
          type: validatorTypes.REQUIRED,
          message: 'This field is required'
        },
        {
          type: validatorTypes.MIN_LENGTH,
          threshold: 5
        },
        {
          type: validatorTypes.MAX_LENGTH,
          threshold: 10
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'my-number-field',
      label: 'Number field',
      type: 'number',
      validate: [
        {
          type: validatorTypes.MAX_NUMBER_VALUE,
          value: 50
        },
        {
          type: validatorTypes.MIN_NUMBER_VALUE,
          value: 14
        }
      ]
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'pattern-field',
      label: 'Pattern field',
      validate: [
        {
          type: validatorTypes.PATTERN_VALIDATOR,
          pattern: /^Foo$/
        }
      ]
    },
    {
      component: componentTypes.SELECT,
      label: 'Select',
      name: 'select',
      initialValue: '2',
      options: [
        {
          label: 'Option 1',
          value: '1'
        },
        {
          label: 'Option 2',
          value: '2'
        },
        {
          label: 'Option 3',
          value: '3'
        }
      ]
    }
  ]
};

const Demo = () => (
  <Fragment>
    <CssBaseline />
    <ThemeProvider theme={createMuiTheme({})}>
      <FormBuilder
        schema={schema}
        schemaTemplate={schemaTemplate}
        pickerMapper={pickerMapper}
        componentProperties={componentProperties}
        componentMapper={builderMapper}
        propertiesMapper={propertiesMapper}
        cloneWhileDragging
        disableDrag={false}
        disableAdd={false}
        mode="subset"
        debug={false}
        render={({ isValid, getSchema, ...props }) => (
          <BuilderTemplate {...props}>
            <div>
              <button onClick={() => console.log(getSchema())}>Click to get state</button>
            </div>
          </BuilderTemplate>
        )}
      />
    </ThemeProvider>
  </Fragment>
);

ReactDom.render(<Demo />, document.getElementById('root'));
