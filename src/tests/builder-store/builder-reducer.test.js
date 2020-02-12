import builderReducer, {
  SET_COLUMNS,
  SET_SELECTED_COMPONENT,
  REMOVE_COMPONENT,
  DRAG_START,
  SET_FIELD_PROPERTY,
  SET_FIELD_VALIDATOR,
  INITIALIZE
} from '../../builder-state/builder-reducer';
import propertiesValidation from '../../properties-editor/initial-value-checker';
import { FORM_LAYOUT } from '../../helpers/create-initial-data';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';

describe('builderReducer', () => {
  let initialState;

  const containerId = '54546421684';

  beforeEach(() => {
    initialState = { initialized: false };
  });

  it('returns default', () => {
    expect(builderReducer(initialState, {})).toEqual(initialState);
  });

  describe(INITIALIZE, () => {
    it('sets initialized to true', () => {
      expect(
        builderReducer(initialState, {
          type: INITIALIZE,
          payload: { custom: 'custom_1' }
        })
      ).toEqual({
        custom: 'custom_1',
        initialized: true
      });
    });
  });

  describe(SET_COLUMNS, () => {
    it('when no destination do nothing', () => {
      const payload = {
        destination: undefined,
        source: {
          droppableId: 'dropId'
        },
        draggableId: 'dragId'
      };

      expect(
        builderReducer(initialState, {
          type: SET_COLUMNS,
          payload
        })
      ).toEqual(initialState);
    });

    it('when moving into itself do nothing', () => {
      const payload = {
        destination: {
          droppableId: 'dropId',
          index: 2
        },
        source: {
          droppableId: 'dropId',
          index: 2
        },
        draggableId: 'dropId'
      };

      expect(
        builderReducer(initialState, {
          type: SET_COLUMNS,
          payload
        })
      ).toEqual(initialState);
    });

    it('when nesting containers do nothing', () => {
      initialState = {
        fields: {
          'draggable-field': { isContainer: true }
        },
        containers: [{ id: containerId, boundaries: [15, 22] }],
        dropTargets: {
          dropId: []
        }
      };

      const payload = {
        destination: {
          droppableId: 'dropId',
          index: 16
        },
        source: {
          droppableId: 'dropId',
          index: 3
        },
        draggableId: 'draggable-field'
      };

      expect(
        builderReducer(initialState, {
          type: SET_COLUMNS,
          payload
        })
      ).toEqual(initialState);
    });

    it('From root to root', () => {
      initialState = {
        fields: {
          'draggable-field': {},
          field2: {}
        },
        containers: [],
        dropTargets: {
          dropId: { fieldsIds: ['draggable-field', 'field2'] }
        }
      };

      const payload = {
        destination: {
          droppableId: 'dropId',
          index: 1
        },
        source: {
          droppableId: 'dropId',
          index: 0
        },
        draggableId: 'draggable-field'
      };

      expect(
        builderReducer(initialState, {
          type: SET_COLUMNS,
          payload
        })
      ).toEqual({
        ...initialState,
        dropTargets: {
          dropId: { fieldsIds: ['field2', 'draggable-field'] }
        }
      });
    });

    it('Move inside container', () => {
      initialState = {
        fields: {
          'draggable-field': { container: 'container' },
          field2: { container: 'container' }
        },
        containers: [{ id: 'container', boundaries: [0, 3] }],
        dropTargets: {
          dropId: { fieldsIds: ['container', 'draggable-field', 'field2', 'container-end'] }
        }
      };

      const payload = {
        destination: {
          droppableId: 'dropId',
          index: 2
        },
        source: {
          droppableId: 'dropId',
          index: 1
        },
        draggableId: 'draggable-field'
      };

      expect(
        builderReducer(initialState, {
          type: SET_COLUMNS,
          payload
        })
      ).toEqual({
        ...initialState,
        dropTargets: {
          dropId: { fieldsIds: ['container', 'field2', 'draggable-field', 'container-end'] }
        }
      });
    });

    // Does not update boundaries, fields
    it.skip('Move into container from root, field was not in container before', () => {
      initialState = {
        fields: {
          'draggable-field': { container: undefined },
          container: { children: [], isContainer: true }
        },
        containers: [{ id: 'container', boundaries: [1, 2] }],
        dropTargets: {
          dropId: { fieldsIds: ['draggable-field', 'container', 'container-end'] }
        }
      };

      const payload = {
        destination: {
          droppableId: 'dropId',
          index: 1
        },
        source: {
          droppableId: 'dropId',
          index: 0
        },
        draggableId: 'draggable-field'
      };

      expect(
        builderReducer(initialState, {
          type: SET_COLUMNS,
          payload
        })
      ).toEqual({
        ...initialState,
        dropTargets: {
          dropId: { fieldsIds: ['container', 'draggable-field', 'container-end'] },
          fields: {
            'draggable-field': { container: 'container' },
            container: { children: ['draggable-field'], isContainer: true }
          },
          containers: [{ id: 'container', boundaries: [0, 2] }]
        }
      });
    });

    // should also move boundaries
    it.skip('outside of container to root', () => {
      initialState = {
        fields: {
          'draggable-field': { container: 'container' },
          container: { children: ['draggable-field'], isContainer: true }
        },
        containers: [{ id: 'container', boundaries: [0, 2] }],
        dropTargets: {
          dropId: { fieldsIds: ['container', 'draggable-field', 'container-end'] }
        }
      };

      const payload = {
        destination: {
          droppableId: 'dropId',
          index: 0
        },
        source: {
          droppableId: 'dropId',
          index: 1
        },
        draggableId: 'draggable-field'
      };

      expect(
        builderReducer(initialState, {
          type: SET_COLUMNS,
          payload
        })
      ).toEqual({
        ...initialState,
        dropTargets: {
          dropId: { fieldsIds: ['draggable-field', 'container', 'container-end'] }
        },
        fields: {
          'draggable-field': {},
          container: { children: [], isContainer: true }
        },
        containers: [{ id: 'container', boundaries: [1, 2] }],
        draggingContainer: undefined
      });
    });

    // Does not update fields, containers
    it.skip('Move field between containers', () => {
      initialState = {
        fields: {
          'draggable-field': { container: 'container1' },
          container1: { children: ['draggable-field'], isContainer: true },
          container2: { children: [], isContainer: true }
        },
        containers: [
          { id: 'container1', boundaries: [0, 2] },
          { id: 'container2', boundaries: [3, 4] }
        ],
        dropTargets: {
          dropId: { id: 'dropId', fieldsIds: ['container1', 'draggable-field', 'container1-end', 'container2', 'container2-end'] }
        }
      };

      const payload = {
        destination: {
          droppableId: 'dropId',
          index: 3
        },
        source: {
          droppableId: 'dropId',
          index: 1
        },
        draggableId: 'draggable-field'
      };

      expect(
        builderReducer(initialState, {
          type: SET_COLUMNS,
          payload
        })
      ).toEqual({
        ...initialState,
        draggingContainer: undefined,
        dropTargets: {
          dropId: { id: 'dropId', fieldsIds: ['container1', 'container1-end', 'container2', 'draggable-field', 'container2-end'] }
        },
        fields: {
          'draggable-field': { container: 'container2' },
          container1: { children: [], isContainer: true },
          container2: { children: ['draggable-field'], isContainer: true }
        },
        containers: [
          { id: 'container1', boundaries: [0, 1] },
          { id: 'container2', boundaries: [2, 4] }
        ]
      });
    });

    it('Copy to column', () => {
      const _Date = Date.now;

      const newId = '876786646465980968';
      Date.now = () => ({
        toString: () => newId
      });

      initialState = {
        fields: {
          'draggable-field': {}
        },
        containers: [],
        dropTargets: {
          dropId: { id: 'dropId', fieldsIds: [] },
          templates: { id: 'templates', fieldsIds: [] }
        }
      };

      const payload = {
        destination: {
          droppableId: 'dropId',
          index: 0
        },
        source: {
          droppableId: 'templates',
          index: 3
        },
        draggableId: 'draggable-field'
      };

      expect(
        builderReducer(initialState, {
          type: SET_COLUMNS,
          payload
        })
      ).toEqual({
        ...initialState,
        draggingContainer: undefined,
        selectedComponent: newId,
        fields: {
          'draggable-field': {},
          [newId]: {
            children: undefined,
            container: undefined,
            id: newId,
            initialized: false,
            name: undefined,
            preview: false
          }
        },
        dropTargets: {
          dropId: { id: 'dropId', fieldsIds: [newId] },
          templates: { id: 'templates', fieldsIds: [] }
        }
      });

      Date.now = _Date;
    });

    it('Copy to column - is container', () => {
      const _Date = Date.now;

      const newId = '876786646465980968';
      Date.now = () => ({
        toString: () => newId
      });

      initialState = {
        fields: {
          'draggable-field': { isContainer: true }
        },
        containers: [],
        dropTargets: {
          dropId: { id: 'dropId', fieldsIds: [] },
          templates: { id: 'templates', fieldsIds: [] }
        }
      };

      const payload = {
        destination: {
          droppableId: 'dropId',
          index: 0
        },
        source: {
          droppableId: 'templates',
          index: 3
        },
        draggableId: 'draggable-field'
      };

      expect(
        builderReducer(initialState, {
          type: SET_COLUMNS,
          payload
        })
      ).toEqual({
        ...initialState,
        draggingContainer: undefined,
        selectedComponent: newId,
        fields: {
          'draggable-field': { isContainer: true },
          [newId]: {
            children: [],
            container: undefined,
            id: newId,
            initialized: false,
            name: undefined,
            preview: false,
            isContainer: true
          },
          [`${newId}-end`]: {
            component: 'container-end',
            id: `${newId}-end`
          }
        },
        dropTargets: {
          dropId: { id: 'dropId', fieldsIds: [newId, `${newId}-end`] },
          templates: { id: 'templates', fieldsIds: [] }
        },
        containers: [{ id: newId, boundaries: [payload.destination.index, payload.destination.index + 1] }]
      });

      Date.now = _Date;
    });

    it('Copy to column - to container', () => {
      const _Date = Date.now;

      const newId = '876786646465980968';
      Date.now = () => ({
        toString: () => newId
      });

      initialState = {
        fields: {
          'draggable-field': {},
          container1: { children: [] }
        },
        containers: [{ id: 'container1', boundaries: [0, 1] }],
        dropTargets: {
          dropId: { id: 'dropId', fieldsIds: ['container1', 'container1-end'] },
          templates: { id: 'templates', fieldsIds: [] }
        }
      };

      const payload = {
        destination: {
          droppableId: 'dropId',
          index: 1
        },
        source: {
          droppableId: 'templates',
          index: 3
        },
        draggableId: 'draggable-field'
      };

      expect(
        builderReducer(initialState, {
          type: SET_COLUMNS,
          payload
        })
      ).toEqual({
        ...initialState,
        draggingContainer: undefined,
        selectedComponent: newId,
        fields: {
          'draggable-field': {},
          [newId]: {
            children: undefined,
            container: 'container1',
            id: newId,
            initialized: false,
            name: undefined,
            preview: false
          },
          container1: { children: [newId] }
        },
        dropTargets: {
          dropId: { id: 'dropId', fieldsIds: ['container1', newId, 'container1-end'] },
          templates: { id: 'templates', fieldsIds: [] }
        },
        containers: [{ id: 'container1', boundaries: [0, 2] }]
      });

      Date.now = _Date;
    });
  });

  describe(SET_SELECTED_COMPONENT, () => {
    it('sets selected component', () => {
      const selectedComponent = { id: '126536' };

      expect(
        builderReducer(initialState, {
          type: SET_SELECTED_COMPONENT,
          payload: selectedComponent
        })
      ).toEqual({
        ...initialState,
        selectedComponent
      });
    });
  });

  describe(REMOVE_COMPONENT, () => {
    it('removes selected component', () => {
      const selectedComponent = '126536';

      initialState = {
        ...initialState,
        fields: {
          [selectedComponent]: { name: 'delete me' },
          7989854: { name: 'do not remove me' }
        },
        containers: [],
        dropTargets: {
          [FORM_LAYOUT]: { fieldsIds: [] }
        }
      };

      expect(
        builderReducer(initialState, {
          type: REMOVE_COMPONENT,
          payload: selectedComponent
        })
      ).toEqual({
        ...initialState,
        fields: {
          7989854: { name: 'do not remove me' }
        }
      });
    });

    it('removes selected component from container', () => {
      const selectedComponent = '126536';

      initialState = {
        ...initialState,
        fields: {
          [selectedComponent]: { name: 'delete me', container: containerId }
        },
        containers: [{ id: containerId, boundaries: [15, 22] }],
        dropTargets: {
          [FORM_LAYOUT]: { fieldsIds: [selectedComponent, '234'] }
        }
      };

      expect(
        builderReducer(initialState, {
          type: REMOVE_COMPONENT,
          payload: selectedComponent
        })
      ).toEqual({
        ...initialState,
        selectedComponent: undefined,
        fields: {},
        containers: [{ id: containerId, boundaries: [15, 21] }],
        dropTargets: {
          [FORM_LAYOUT]: { fieldsIds: ['234'] }
        }
      });
    });
  });

  describe(DRAG_START, () => {
    it('sets dragging container', () => {
      initialState = {
        initialized: true,
        fields: {
          125: { name: 'cosi', isContainer: true }
        }
      };

      expect(
        builderReducer(initialState, {
          type: DRAG_START,
          payload: { draggableId: '125' }
        })
      ).toEqual({
        ...initialState,
        draggingContainer: '125'
      });
    });

    it("does not set dragging container when it's not container", () => {
      initialState = {
        initialized: true,
        fields: {
          125: { name: 'cosi', isContainer: false }
        }
      };

      expect(
        builderReducer(initialState, {
          type: DRAG_START,
          payload: { draggableId: '125' }
        })
      ).toEqual(initialState);
    });

    it('does not set dragging container when id is initial', () => {
      initialState = {
        initialized: true,
        fields: {
          'initial-151': { name: 'cosi', isContainer: true }
        }
      };

      expect(
        builderReducer(initialState, {
          type: DRAG_START,
          payload: { draggableId: 'initial-151' }
        })
      ).toEqual(initialState);
    });
  });

  describe(SET_FIELD_PROPERTY, () => {
    it('sets field property according to fieldId', () => {
      initialState = {
        initialized: true,
        fields: {
          125: { name: 'do not change me 1' },
          1515: { name: 'change me' }
        }
      };

      expect(
        builderReducer(initialState, {
          type: SET_FIELD_PROPERTY,
          payload: { fieldId: 1515, propertyName: 'custom', value: 'customValue' }
        })
      ).toEqual({
        ...initialState,
        fields: {
          125: { name: 'do not change me 1' },
          1515: {
            name: 'change me',
            initialized: true,
            custom: 'customValue',
            propertyValidation: {}
          }
        }
      });
    });

    it('sets field property according to fieldId and validate property', () => {
      initialState = {
        initialized: true,
        fields: {
          125: { name: 'do not change me 1' },
          1515: { name: 'change me' }
        }
      };

      expect(
        builderReducer(initialState, {
          type: SET_FIELD_PROPERTY,
          payload: { fieldId: 1515, propertyName: 'isDisabled', value: true }
        })
      ).toEqual({
        ...initialState,
        fields: {
          125: { name: 'do not change me 1' },
          1515: {
            name: 'change me',
            initialized: true,
            isDisabled: true,
            propertyValidation: propertiesValidation('isDisabled')({
              name: 'change me'
            })
          }
        }
      });
    });
  });

  describe(SET_FIELD_VALIDATOR, () => {
    it('adds field validator according to fieldId', () => {
      initialState = {
        initialized: true,
        fields: {
          125: { name: 'do not change me 1' },
          1515: { name: 'change me' },
          1: { name: 'do not change me 2' }
        }
      };

      expect(
        builderReducer(initialState, {
          type: SET_FIELD_VALIDATOR,
          payload: { fieldId: 1515, action: 'add', type: 'length' }
        })
      ).toEqual({
        ...initialState,
        fields: {
          125: { name: 'do not change me 1' },
          1515: { name: 'change me', validate: [{ type: 'length' }] },
          1: { name: 'do not change me 2' }
        }
      });
    });

    it('adds required field validator - appends isRequired', () => {
      initialState = {
        initialized: true,
        fields: {
          125: { name: 'do not change me 1' },
          1515: { name: 'change me' },
          1: { name: 'do not change me 2' }
        }
      };

      expect(
        builderReducer(initialState, {
          type: SET_FIELD_VALIDATOR,
          payload: { fieldId: 1515, action: 'add', type: validatorTypes.REQUIRED }
        })
      ).toEqual({
        ...initialState,
        fields: {
          125: { name: 'do not change me 1' },
          1515: { name: 'change me', validate: [{ type: validatorTypes.REQUIRED }], isRequired: true },
          1: { name: 'do not change me 2' }
        }
      });
    });

    it('removes field validator according to fieldId', () => {
      initialState = {
        initialized: true,
        fields: {
          125: { name: 'do not change me 1' },
          1: { name: 'do not change me 2' },
          1515: {
            name: 'change me',
            validate: [{ type: 'required' }, { type: 'remove me' }, { type: 'leave me alone' }]
          }
        }
      };

      expect(
        builderReducer(initialState, {
          type: SET_FIELD_VALIDATOR,
          payload: { fieldId: 1515, action: 'remove', index: 1 }
        })
      ).toEqual({
        ...initialState,
        fields: {
          125: { name: 'do not change me 1' },
          1: { name: 'do not change me 2' },
          1515: {
            name: 'change me',
            validate: [{ type: 'required' }, { type: 'leave me alone' }]
          }
        }
      });
    });

    it('modifes field validator according to fieldId', () => {
      initialState = {
        initialized: true,
        fields: {
          125: { name: 'do not change me 1' },
          1: { name: 'do not change me 2' },
          1515: {
            name: 'change me',
            validate: [{ type: 'please i want to be changed' }, { type: 'i am not here' }, { type: 'leave me alone' }]
          }
        }
      };

      expect(
        builderReducer(initialState, {
          type: SET_FIELD_VALIDATOR,
          payload: { fieldId: 1515, action: 'modify', index: 0, asYouWish: true }
        })
      ).toEqual({
        ...initialState,
        fields: {
          125: { name: 'do not change me 1' },
          1: { name: 'do not change me 2' },
          1515: {
            name: 'change me',
            validate: [{ type: 'please i want to be changed', asYouWish: true }, { type: 'i am not here' }, { type: 'leave me alone' }]
          }
        }
      });
    });
  });
});
