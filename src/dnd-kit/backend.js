import { arrayMove } from '@dnd-kit/sortable';

export const MAIN_CONTAINER = 'main-container';

const SET_ACTIVE_ID = 'SET_ACTIVE_ID';
const SET_ITEMS = 'SET_ITEMS';
const ADD_ITEM = 'ADD_ITEM';
const SORT_ITEMS = 'SORT_ITEMS';
export const initialState = {
  activeId: undefined,
  templates: {},
  fields: {},
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

const addToContainer = (state, containerId, newId, collisionId, template) => {
  const position = state.containers[containerId].children.findIndex((id) => id === collisionId);
  return {
    ...state,
    fields: {
      ...state.fields,
      [newId]: template,
    },
    containers: {
      ...state.containers,
      ...(template.isContainer ? { [newId]: { children: [] } } : {}),
      [containerId]: {
        ...state.containers[containerId],
        children: [
          ...state.containers[containerId].children.slice(0, position + 1),
          newId,
          ...state.containers[containerId].children.slice(position + 1),
        ],
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
  template.id = newId;
  if (collisionId === MAIN_CONTAINER) {
    return {
      ...state,
      fields: {
        ...state.fields,
        [newId]: template,
      },
      containers: {
        ...state.containers,
        ...(template.isContainer ? { [newId]: { children: [] } } : {}),
        [MAIN_CONTAINER]: {
          ...state.containers[MAIN_CONTAINER],
          children: [...state.containers[MAIN_CONTAINER].children, newId],
        },
      },
    };
  }
  return addToContainer(state, findInjection(state, collisionId), newId, collisionId, template);
};

const sortTreeItems = (state, { itemId, collisionId }) => {
  const currentContainer = findInjection(state, itemId, true);
  const targetContainer = findInjection(state, collisionId);
  if (currentContainer === targetContainer) {
    const oldIndex = state.containers[currentContainer].children.indexOf(itemId);
    const newIndex = state.containers[currentContainer].children.indexOf(collisionId);
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
    default:
      return state;
  }
};

export default reducer;
