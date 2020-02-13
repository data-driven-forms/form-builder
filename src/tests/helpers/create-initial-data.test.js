import createInitialData from '../../helpers/create-initial-data';
import { initialBuilderFields, initialDDFSchema, initialDDFSchemaTemplate } from '../__mocks__/builder-fields';

describe('create unitial data', () => {
  jest.spyOn(Date, 'now').mockImplementation(() => 123);
  it('should create initial builder state', () => {
    const expectedState = {
      containers: [],
      dropTargets: {
        'components-list': {
          fieldsIds: ['text-field', 'options-component'],
          id: 'components-list',
          title: 'Component picker'
        },
        'form-layout': {
          fieldsIds: ['first-name-123', 'options-select-123'],
          id: 'form-layout',
          title: 'Form'
        }
      },
      fields: {
        'first-name-123': {
          clone: true,
          component: 'text-field',
          id: 'first-name-123',
          initialized: true,
          name: 'first-name',
          preview: false,
          validate: [
            {
              type: 'required-validator',
              message: 'I am required'
            }
          ]
        },
        'text-field': {
          attributes: [
            {
              component: 'input',
              label: 'Label',
              propertyName: 'label'
            }
          ]
        },
        'options-component': {
          attributes: [
            {
              component: 'options',
              label: 'Options',
              propertyName: 'options'
            }
          ]
        },
        'options-select-123': {
          clone: true,
          component: 'options-component',
          id: 'options-select-123',
          initialized: true,
          name: 'options-select',
          validate: [
            {
              message: 'I am required',
              type: 'required-validator'
            }
          ],
          options: [
            {
              label: 'First option',
              value: 1
            }
          ],
          preview: false
        }
      },
      selectedComponent: undefined
    };

    expect(createInitialData(initialBuilderFields, initialDDFSchema)).toEqual(expectedState);
  });

  it('should create initial schema in subset mode without template', () => {
    const expectedState = expect.objectContaining({
      fields: expect.objectContaining({
        'first-name-123': {
          clone: true,
          component: 'text-field',
          id: 'first-name-123',
          initialized: true,
          name: 'first-name',
          options: undefined,
          preview: false,
          restricted: true,
          validate: [
            {
              type: 'required-validator',
              message: 'I am required',
              original: {
                type: 'required-validator',
                message: 'I am required'
              }
            }
          ]
        }
      })
    });
    expect(createInitialData(initialBuilderFields, initialDDFSchema, true)).toEqual(expectedState);
  });
  it('should create initial schema in subset mode with template', () => {
    const expectedState = expect.objectContaining({
      fields: {
        'first-name-123': {
          clone: true,
          component: 'text-field',
          id: 'first-name-123',
          initialized: true,
          name: 'first-name',
          options: undefined,
          preview: false,
          restricted: true,
          validate: [
            {
              message: 'I am required',
              original: {
                message: 'I am required',
                type: 'required-validator'
              },
              type: 'required-validator'
            }
          ]
        },
        'options-component': {
          attributes: [
            {
              component: 'options',
              label: 'Options',
              propertyName: 'options'
            }
          ]
        },
        'options-select-123': {
          clone: true,
          component: 'options-component',
          id: 'options-select-123',
          initialized: true,
          name: 'options-select',
          validate: [
            {
              type: 'required-validator',
              message: 'I am required',
              original: {
                type: 'required-validator',
                message: 'I am required'
              }
            }
          ],
          options: [
            {
              label: 'First option',
              restoreable: true,
              value: 1
            },
            {
              deleted: true,
              label: 'Second deleted option',
              restoreable: true,
              value: 2
            }
          ],
          preview: false,
          restricted: true
        },
        'text-field': {
          attributes: [
            {
              component: 'input',
              label: 'Label',
              propertyName: 'label'
            }
          ]
        }
      }
    });
    expect(createInitialData(initialBuilderFields, initialDDFSchema, true, initialDDFSchemaTemplate)).toEqual(expectedState);
  });
});
