export const fields = {
  'initial-should-not-be-in-output': {
    key: 'value',
  },
  'should-remove-all-attributes': {
    name: 'only-name',
    preview: 'value',
    clone: 'value',
    initialized: 'value',
    id: 'value',
    isContainer: 'value',
    children: 'value',
    container: 'value',
    restricted: 'value',
  },
  '123-text-field': {
    name: 'foo',
    label: 'Text field',
    isRequired: true,
    validate: [{ type: 'required-validator' }],
  },
};

export const schemaWithDeletedOption = {
  'deleted-option-field': {
    name: 'deleted-option-field',
    options: [
      {
        value: 'foo',
        label: 'foo',
        deleted: true,
      },
      {
        value: 'bar',
        label: 'bar',
      },
    ],
  },
};

export const invalidSchema = {
  'invalid-field': {
    name: 'invalid-field',
    propertyValidation: {
      invalidProperty: {
        message: 'this field is invalid',
      },
    },
  },
};

export const initialBuilderFields = {
  'text-field': {
    attributes: [
      {
        component: 'input',
        label: 'Label',
        propertyName: 'label',
      },
    ],
  },
  'options-component': {
    attributes: [
      {
        component: 'options',
        label: 'Options',
        propertyName: 'options',
      },
    ],
  },
};

export const initialDDFSchema = {
  fields: [
    {
      name: 'first-name',
      component: 'text-field',
      validate: [
        {
          type: 'required-validator',
          message: 'I am required',
        },
      ],
    },
    {
      name: 'options-select',
      component: 'options-component',
      validate: [
        {
          type: 'required-validator',
          message: 'I am required',
        },
      ],
      options: [
        {
          label: 'First option',
          value: 1,
        },
      ],
    },
  ],
};

export const initialDDFSchemaTemplate = {
  fields: [
    {
      name: 'options-select',
      component: 'options-component',
      validate: [
        {
          type: 'required-validator',
          message: 'I am required',
        },
      ],
      options: [
        {
          label: 'First option',
          value: 1,
        },
        {
          label: 'Second deleted option',
          value: 2,
        },
      ],
    },
  ],
};
