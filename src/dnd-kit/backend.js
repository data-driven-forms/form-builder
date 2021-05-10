import { arrayMove } from '@dnd-kit/sortable';
import convertInitialValue from '@data-driven-forms/react-form-renderer/use-field-api/convert-initial-value';
import propertiesValidation from '../properties-editor/initial-value-checker';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export const MAIN_CONTAINER = 'main-container';

const SET_ACTIVE_ID = 'SET_ACTIVE_ID';
const SET_ITEMS = 'SET_ITEMS';
const ADD_ITEM = 'ADD_ITEM';
const SORT_ITEMS = 'SORT_ITEMS';
const SET_SELECTED_COMPONENT = 'SET_SELECTED_COMPONENT';
const REMOVE_COMPONENT = 'REMOVE_COMPONENT';
const SET_FIELD_PROPERTY = 'SET_FIELD_PROPERTY';
const SET_FIELD_VALIDATOR = 'SET_FIELD_VALIDATOR';
const SET_CONTAINER_CHILDREN = 'SET_CONTAINER_CHILDREN';
const ADD_SUB_CONTAINER = 'ADD_SUB_CONTAINER';

export const initialState = {
  activeId: undefined,
  templates: {},
  fields: {},
  selectedComponent: '',
  containers: {
    [MAIN_CONTAINER]: {
      accessor: 'tree',
      children: [],
    },
  },
};

export const setActiveId = (id) => ({
  type: SET_ACTIVE_ID,
  payload: id,
});

export const setSelectedComponent = (id) => ({
  type: SET_SELECTED_COMPONENT,
  payload: id,
});

export const setItems = (items) => ({
  type: SET_ITEMS,
  payload: items,
});

export const addItem = (itemId, collisionId) => ({
  type: ADD_ITEM,
  payload: {
    itemId,
    collisionId,
  },
});

export const sortItems = (itemId, collisionId) => ({
  type: SORT_ITEMS,
  payload: {
    itemId,
    collisionId,
  },
});

export const removeComponent = (itemId) => ({
  type: REMOVE_COMPONENT,
  payload: { itemId },
});

export const setFieldProperty = (itemId, propertyName, value, dataType) => ({
  type: SET_FIELD_PROPERTY,
  payload: {
    value: convertInitialValue(value, dataType),
    propertyName,
    itemId: itemId,
  },
});

export const setFieldValidator = (itemId, value, index, action) => ({
  type: SET_FIELD_VALIDATOR,
  payload: {
    ...value,
    itemId,
    index,
    action,
  },
});

export const setContainerChildren = (containerId, callback) => ({
  type: SET_CONTAINER_CHILDREN,
  payload: {
    containerId,
    callback,
  },
});

export const addSubcontainer = (containerId) => ({
  type: ADD_SUB_CONTAINER,
  payload: {
    containerId,
  },
});

const addToContainer = (state, containerId, newId, collisionId, template, intialChildren = [], initialChild) => {
  let position;
  if (collisionId.match(/^voidzone-(top|bot)/)) {
    if (collisionId.match(/^voidzone-top/)) {
      position = 0;
    } else {
      position = state.containers[containerId].children.length;
    }
  } else {
    position = state.containers[containerId].children.findIndex((id) => id === collisionId) + 1;
  }
  return {
    ...state,
    fields: {
      ...state.fields,
      [newId]: template,
    },
    containers: {
      ...state.containers,
      ...(template.isContainer ? { [newId]: { children: intialChildren, childrenTemplate: initialChild } } : {}),
      [containerId]: {
        ...state.containers[containerId],
        children: [...state.containers[containerId].children.slice(0, position), newId, ...state.containers[containerId].children.slice(position)],
      },
    },
  };
};

const findInjection = (state, collisionId, selfContainer) => {
  let firstContainer;
  const keys = Object.keys(state.containers);
  /**
   * prevent container to adding into itself
   */
  if (!selfContainer && keys.includes(collisionId)) {
    firstContainer = collisionId;
  }
  if (!firstContainer) {
    let currentIndex = 0;
    while (!firstContainer && currentIndex < keys.length) {
      firstContainer = state.containers[keys[currentIndex]].children.find((id) => id === collisionId) ? keys[currentIndex] : undefined;
      currentIndex += 1;
    }
  }
  if (!firstContainer) {
    firstContainer = MAIN_CONTAINER;
  }
  return firstContainer;
};

const addNewItem = (state, { itemId, collisionId }) => {
  const newId = itemId.replace(/^template/, `field-${Date.now() + Math.random()}`);
  const template = { ...state.templates[itemId] };
  let newState = { ...state };
  let nestedTemplateName;
  let nestedContainer;
  let initialChild;
  if (template.isNestedContainer) {
    initialChild = state.componentProperties[template.component].nestedTemplate;
    nestedContainer = `${newId}-nested-0`;
    let nestedTemplate;

    nestedTemplate = {
      isNestedTemplate: true,
      isContainer: true,
      component: nestedTemplateName,
      id: nestedTemplateName,
    };
    newState = {
      ...newState,
      fields: {
        ...newState.fields,
        [nestedContainer]: { ...initialChild, id: nestedContainer, name: 'first-tab' },
      },
      ...(newState.templates[!nestedTemplateName]
        ? {
            ...newState.templates,
            [nestedTemplateName]: nestedTemplate,
          }
        : {}),
      containers: {
        ...newState.containers,
        [nestedContainer]: {
          children: [],
        },
      },
    };
  }
  template.id = newId;
  if (collisionId === MAIN_CONTAINER) {
    return {
      ...newState,
      fields: {
        ...newState.fields,
        [newId]: template,
      },
      containers: {
        ...newState.containers,
        ...(template.isContainer
          ? {
              [newId]: {
                childrenTemplate: initialChild,
                children: nestedContainer ? [nestedContainer] : [],
              },
            }
          : {}),
        [MAIN_CONTAINER]: {
          ...newState.containers[MAIN_CONTAINER],
          children: [...newState.containers[MAIN_CONTAINER].children, newId],
        },
      },
    };
  }
  return addToContainer(
    newState,
    findInjection(newState, collisionId),
    newId,
    collisionId,
    template,
    nestedContainer ? [nestedContainer] : undefined,
    initialChild
  );
};

const removeItem = (state, { itemId }) => {
  const newFields = state.fields;
  delete newFields[itemId];

  const newContainers = Object.keys(state.containers).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: {
        ...state.containers[curr],
        children: state.containers[curr].children.filter((id) => id !== itemId),
      },
    }),
    {}
  );

  return {
    ...state,
    fields: newFields,
    containers: newContainers,
    selectedComponent: '',
  };
};

const changeFieldProperty = (field, { propertyName, value }) => ({
  ...field,
  [propertyName]: value,
  propertyValidation: {
    ...field.propertyValidation,
    ...propertiesValidation(propertyName)({ ...field, [propertyName]: value }),
  },
});

const changeValidator = (field, { index, action, itemId, ...validator }) => {
  const result = { ...field };
  const validate = result.validate || [];
  if (validator.type === validatorTypes.REQUIRED) {
    result.isRequired = action !== 'remove';
  }
  if (action === 'remove') {
    result.validate = [...validate.slice(0, index), ...validate.slice(index + 1)];
  }

  if (action === 'add') {
    result.validate = [...validate, { ...validator }];
  }

  if (action === 'modify') {
    result.validate = validate.map((item, itemIndex) => (itemIndex === index ? { ...item, ...validator } : item));
  }

  return result;
};

const sortTreeItems = (state, { itemId, collisionId }) => {
  const currentContainer = findInjection(state, itemId, true);
  const targetContainer = findInjection(state, collisionId);
  if (currentContainer === targetContainer) {
    let oldIndex = state.containers[currentContainer].children.indexOf(itemId);
    let newIndex;
    if (collisionId.match(/^voidzone-(top|bot)/)) {
      newIndex = collisionId.match(/^voidzone-top/) ? 0 : state.containers[currentContainer].children.length;
    } else {
      newIndex = state.containers[currentContainer].children.indexOf(collisionId);
    }
    return {
      ...state,
      containers: {
        ...state.containers,
        [currentContainer]: {
          ...state.containers[currentContainer],
          children: arrayMove(state.containers[currentContainer].children, oldIndex, newIndex),
        },
      },
    };
  } else {
    const currentChildren = state.containers[currentContainer].children.filter((id) => id !== itemId);
    const targetChildren = state.containers[targetContainer].children;
    const collisionIndex = targetChildren.indexOf(collisionId);
    const newChildren = [...targetChildren.slice(0, collisionIndex), itemId, ...targetChildren.slice(collisionIndex)];
    return {
      ...state,
      containers: {
        ...state.containers,
        [currentContainer]: { children: currentChildren },
        [targetContainer]: { children: newChildren },
      },
    };
  }
};

const createContainerChild = (state, containerId) => {
  /**
   * NOTE come up with better naming than date number
   */
  const newContainerFieldId = `${containerId}-nested-${Date.now()}`;
  const newContainerField = { ...state.containers[containerId].childrenTemplate, id: newContainerFieldId, name: newContainerFieldId };
  return {
    ...state,
    fields: {
      ...state.fields,
      [newContainerFieldId]: newContainerField,
    },
    containers: {
      ...state.containers,
      [newContainerFieldId]: {
        children: [],
      },
      [containerId]: {
        ...state.containers[containerId],
        children: [...state.containers[containerId].children, newContainerFieldId],
      },
    },
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_ACTIVE_ID:
      return { ...state, activeId: action.payload };
    case SET_ITEMS:
      return { ...state, tree: action.payload };
    case SORT_ITEMS:
      return sortTreeItems(state, action.payload);
    case ADD_ITEM:
      return addNewItem(state, action.payload);
    case SET_SELECTED_COMPONENT:
      return { ...state, selectedComponent: action.payload };
    case REMOVE_COMPONENT:
      return removeItem(state, action.payload);
    case SET_FIELD_PROPERTY:
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.itemId]: changeFieldProperty(state.fields[action.payload.itemId], action.payload),
        },
      };
    case SET_CONTAINER_CHILDREN: {
      return {
        ...state,
        containers: {
          ...state.containers,
          [action.payload.containerId]: {
            ...state.containers[action.payload.containerId],
            children: action.payload.callback(state.containers[action.payload.containerId].children),
          },
        },
      };
    }
    case ADD_SUB_CONTAINER:
      return createContainerChild(state, action.payload.containerId);
    case SET_FIELD_VALIDATOR:
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.itemId]: changeValidator(state.fields[action.payload.itemId], action.payload),
        },
      };
    default:
      return state;
  }
};

export default reducer;
