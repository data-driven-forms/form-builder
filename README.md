[![codecov](https://codecov.io/gh/data-driven-forms/form-builder/branch/master/graph/badge.svg)](https://codecov.io/gh/data-driven-forms/form-builder)
[![CircleCI](https://circleci.com/gh/data-driven-forms/react-forms/tree/master.svg?style=svg)](https://circleci.com/gh/data-driven-forms/form-builder/tree/master)
[![npm version](https://badge.fury.io/js/%40data-driven-forms%2Fform-builder.svg)](https://badge.fury.io/js/%40data-driven-forms%2Fform-builder)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/tterb/hyde.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20DataDrivenForms%20React%20library%21%20https%3A%2F%2Fdata-driven-forms.org%2F&hashtags=react,opensource,datadrivenforms)
[![Twitter Follow](https://img.shields.io/twitter/follow/DataDrivenForms.svg?style=social)](https://twitter.com/DataDrivenForms)

[![Data Driven Form logo](https://raw.githubusercontent.com/data-driven-forms/react-forms/master/images/logo.png)](https://data-driven-forms.org/)

# FormBuilder

**THIS PROJECT IS WORK IN PROGRESS. ALL THE API IS CONSIDERED UNSTABLE. EVERYTHING CAN BE CHANGED. NEW FEATURES/BUG FIXES CAN TAKE A LONG TIME TO IMPLEMENT.**

This component allows to build [Data Driven Forms](https://github.com/data-driven-forms/react-forms) forms via DnD feature.

**Table of contents**

- [FormBuilder](#formbuilder)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
  - [render or children](#render-or-children)
  - [componentMapper](#componentmapper)
  - [builderMapper](#buildermapper)
    - [FieldLayout](#fieldlayout)
    - [PropertiesEditor](#propertieseditor)
    - [FormContainer](#formcontainer)
    - [BUILDER_FIELD](#builder_field)
    - [BuilderColumn](#buildercolumn)
    - [PropertyGroup](#propertygroup)
    - [DragHandle](#draghandle)
    - [EmptyTarget](#emptytarget)
  - [componentProperties](#componentproperties)
    - [attributes](#attributes)
      - [propertyName](#propertyname)
      - [label](#label)
      - [component](#component)
    - [disableValidators](#disablevalidators)
    - [disableInitialValue](#disableinitialvalue)
    - [Example](#example)
  - [pickerMapper](#pickermapper)
  - [propertiesMapper](#propertiesmapper)
  - [mode](#mode)
  - [schema](#schema)
  - [schemaTemplate](#schematemplate)
  - [cloneWhileDragging](#clonewhiledragging)
  - [debug](#debug)
  - [openEditor](#openeditor)
  - [disabledAdd](#disabledadd)
  - [disableDrag](#disabledrag)
- [Mappers](#mappers)
  - [Material UI](#material-ui)
  - [PatternFly 4](#patternfly-4)
  - [Example](#example-1)

# Installation

`npm install --save @data-driven-forms/form-builder`

or

`yarn add @data-driven-forms/form-builder`

# Usage

Import form builder:

```jsx
import FormBuilder from '@data-driven-forms/form-builder/form-builder';
```

and render the component with following props:

# Props

## render or children

*({ ComponentPicker, PropertiesEditor, DropTarget, isValid, getSchema, children }) => React.Element*

Use children or a render function to render the whole editor.

## componentMapper

*object*

Data Driven Forms component mapper. See [here](https://data-driven-forms.org/components/renderer#heading-formrenderer#requiredprops).

## builderMapper

*object*

A set of components that creates the form builder.

```jsx
import { builderComponentTypes } from '../src/constants';


const builderMapper = {
    FieldLayout,
    PropertiesEditor,
    FormContainer,
    [builderComponentTypes.BUILDER_FIELD]: builderField,
    BuilderColumn,
    PropertyGroup,
    DragHandle,
    EmptyTarget
}
```

![image](https://user-images.githubusercontent.com/32869456/95745136-d6995c00-0c94-11eb-9f86-88fe1417e743.png)

### FieldLayout

*({ children, disableDrag, dragging, selected }) => React.Element*

A wrapper around a single field = BUILDER_FORM + DragHandle.

### PropertiesEditor

*({*
  *propertiesChildren,*
  *validationChildren,*
  *addValidator*,
  *avaiableValidators*,
  *handleClose*,
  *handleDelete*,
  *hasPropertyError*
*}) => React.Element*

An editor.

### FormContainer

*({ children, isDraggingOver }) => React.Element*

A wrapper around the form in the form column.

### BUILDER_FIELD

*({*
  *innerProps: { hideField, snapshot },*
  *Component*,
  *propertyName*,
  *fieldId*,
  *propertyValidation*,
  *hasPropertyError*,
  *...props*
*}) => React.Element*

A wrapper around the field.

### BuilderColumn

*({ children, isDraggingOver }) => React.Element*

A column.

### PropertyGroup

*({ className, children, title, handleDelete }) => React.Element*

A wrapper around a single property group in the properties editor > validation.

### DragHandle

*({ dragHandleProps, hasPropertyError, disableDrag }) => React.Element*

A drag handle. Is passed as a child to FieldLayout.

### EmptyTarget

*() => React.Element*

EmptyTarget is shown when there are no fields created.

## componentProperties

*object*

A mapper of editable properties for each component. A property is a object with following attributes:

### attributes

Editable attributes of the component.
#### propertyName

*string*

Corresponds to an attribute in the schema.

#### label

*string*

A label shown for the property in the editor.

#### component

*string*

A component corresponding to a key in properties mapper.

### disableValidators

Disables validator selection in `PropertiesEditor`.

Automatically disabled in fields that are not registered in the form state.

### disableInitialValue

Disables initial value field in `PropertiesEditor`.

Automatically disabled in fields that are not registered in the form state.

### Example

```jsx
const LABEL = {
    propertyName: 'label',
    label: 'Label',
    component: 'input'
}

const componentProperties = {
    [componentTypes.TEXT_FIELD]: {
        attributes: [LABEL, IS_REQUIRED]
    },
    [componentTypes.PLAIN_TEXT]: {
        attributes: [LABEL],
        disableValidators: true,
        disableInitialValue: true
    }
}
```

## pickerMapper

*object*

A mapper of components available in the editor.

```jsx
const pickerMapper = {
    [componentTypes.TEXT_FIELD]: ({ component }) => <div>{component}</div>
}
```

## propertiesMapper

*object*

A mapper of components available in component properties.

```jsx
const propertiesMapper = {
    input: ({ label, value, fieldId, innerProps: { propertyValidation }, ...rest }) => <input {...rest} />
}
```

## mode

*one of 'subset' | 'default'* optional

If 'subset', options will be only editable to certain degree. See schemaTemplate.

## schema

*object* optional

A Data Driven Forms schema. See [here](https://data-driven-forms.org/components/renderer#heading-formrenderer#requiredprops).

## schemaTemplate

*object* optional

An original schema from which a subset is created. If not specified, editable boundaries will be created from the schema.

## cloneWhileDragging

*boolean* optional

Components from the components list are being cloned when dragged.

## debug

*boolean* optional

Turns on debug mode. Will show current field as a JSON object.

## openEditor

*boolean* optional

Opens the first field on mount.

## disabledAdd

*boolean* optional

Disables adding new fields.

## disableDrag

*boolean* optional

Disables dragging.

# Mappers

Form builder contains two mappers of components: **PatternFly 4** and **Material UI** versions.

## Material UI

```jsx
import {
  pickerMapper,
  propertiesMapper,
  builderMapper,
  BuilderTemplate,
  fieldProperties
} from '@data-driven-forms/form-builder/mui-builder-mappers';
```

## PatternFly 4

```jsx
import {
  pickerMapper,
  propertiesMapper,
  builderMapper,
  BuilderTemplate,
  fieldProperties
} from '@data-driven-forms/form-builder/pf4-builder-mappers';
```

## Example

```jsx
render={({ isValid, getSchema, ...props }) => (
  <BuilderTemplate {...props} className={classes.builderWrapper}>
    <CodeEditor value={JSON.stringify(getSchema(), null, 2)} />
  </BuilderTemplate>
)}
```
