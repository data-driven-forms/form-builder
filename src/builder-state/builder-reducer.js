import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import propertiesValidation from '../properties-editor/initial-value-checker';
import { FORM_LAYOUT, COMPONENTS_LIST } from '../helpers/create-initial-data';

const mutateColumns = (result, state) => {
  const { destination, source, draggableId } = result;
  const { dropTargets, fields, selectedComponent } = state;

  console.log({ result, state });

  if (!destination) {
    return {};
  }

  if (destination.droppableId === draggableId) {
    return {};
  }

  if (destination.droppableId === source.droppableId && destination.index === source.index) {
    return {};
  }

  const start = dropTargets[source.droppableId];
  const finish = dropTargets[destination.droppableId];
  const template = fields[draggableId];

  const isMovingInColumn = start === finish;

  if (isMovingInColumn) {
    const newFieldsIds = [...start.fieldsIds];
    const newFields = { ...fields };

    newFieldsIds.splice(source.index, 1);
    newFieldsIds.splice(destination.index, 0, draggableId);
    return {
      fields: newFields,
      dropTargets: {
        ...dropTargets,
        [source.droppableId]: { ...start, fieldsIds: newFieldsIds }
      }
    };
  }

  const isMovingBetweenContainers =
    ![FORM_LAYOUT, COMPONENTS_LIST].includes(destination.droppableId) && source.droppableId !== destination.droppableId;

  if (isMovingBetweenContainers) {
    return {
      dropTargets: {
        ...dropTargets,
        [FORM_LAYOUT]: {
          ...dropTargets[FORM_LAYOUT],
          fieldsIds: dropTargets[FORM_LAYOUT]['fieldsIds'].filter((id) => id !== draggableId)
        }
      },
      fields: {
        ...fields,
        [destination.droppableId]: {
          ...fields[destination.droppableId],
          fields: fields[destination.droppableId]['fields'] ? [...fields[destination.droppableId]['fields'], draggableId] : [draggableId]
        },
        ...(fields[source.droppableId] &&
          fields[source.droppableId]['fields'] && {
            [source.droppableId]: {
              ...fields[source.droppableId],
              fields: fields[source.droppableId]['fields'].filter((id) => id !== draggableId)
            }
          })
      }
    };
  }

  const movingOutsideNest = ![COMPONENTS_LIST, FORM_LAYOUT].includes(source.droppableId) && destination.droppableId === FORM_LAYOUT;

  if (movingOutsideNest) {
    return {
      dropTargets: {
        ...dropTargets,
        [FORM_LAYOUT]: {
          ...dropTargets[FORM_LAYOUT],
          fieldsIds: [...dropTargets[FORM_LAYOUT]['fieldsIds'], draggableId]
        }
      },
      fields: {
        ...fields,
        [source.droppableId]: {
          ...fields[source.droppableId],
          fields: fields[source.droppableId]['fields'].filter((id) => id !== draggableId)
        }
      }
    };
  }

  const newId = Date.now().toString();
  const finishFieldsIds = [...finish.fieldsIds];

  const newFields = {
    ...fields,
    [newId]: {
      ...fields[draggableId],
      name: fields[draggableId].component,
      preview: false,
      id: newId,
      initialized: false,
      children: null
    }
  };

  finishFieldsIds.splice(destination.index, 0, newId);

  const newFinish = {
    ...finish,
    fieldsIds: finishFieldsIds
  };
  return {
    dropTargets: { ...dropTargets, [newFinish.id]: newFinish },
    fields: newFields,
    selectedComponent: newId
  };
};

const removeComponent = (componentId, state) => {
  const { fields } = state;

  delete fields[componentId];

  return {
    selectedComponent: undefined,
    dropTargets: {
      ...state.dropTargets,
      [FORM_LAYOUT]: {
        ...state.dropTargets[FORM_LAYOUT],
        fieldsIds: state.dropTargets[FORM_LAYOUT].fieldsIds.filter((id) => id !== componentId)
      }
    },
    fields: Object.keys(fields).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: {
          ...fields[curr],
          ...(fields[curr].fields && { fields: fields[curr].fields.filter((id) => id !== componentId) })
        }
      }),
      {}
    )
  };
};

const setFieldproperty = (field, payload) => {
  const modifiedField = {
    ...field,
    initialized: true,
    [payload.propertyName]: payload.value
  };
  return {
    ...modifiedField,
    propertyValidation: {
      ...modifiedField.propertyValidation,
      ...propertiesValidation(payload.propertyName)(modifiedField)
    }
  };
};

const dragStart = (field) => {
  if (field.draggableId.match(/^initial-/)) {
    return {};
  }
  return {
    dragging: field.draggableId
  };
};

const changeValidator = (field, { index, action, fieldId, ...validator }) => {
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

export const SET_COLUMNS = 'setColumns';
export const SET_SELECTED_COMPONENT = 'setSelectedComponent';
export const REMOVE_COMPONENT = 'removeComponent';
export const DRAG_START = 'dragStart';
export const SET_FIELD_PROPERTY = 'setFieldProperty';
export const SET_FIELD_VALIDATOR = 'setFieldValidator';
export const INITIALIZE = 'initialize';

const builderReducer = (state, action) => {
  console.log(state, action);
  switch (action.type) {
    case INITIALIZE:
      return { ...state, ...action.payload, initialized: true };
    case SET_COLUMNS:
      return {
        ...state,
        ...mutateColumns(action.payload, state)
      };
    case SET_SELECTED_COMPONENT:
      return { ...state, selectedComponent: action.payload };
    case REMOVE_COMPONENT:
      return { ...state, ...removeComponent(action.payload, state) };
    case DRAG_START:
      return { ...state, ...dragStart(action.payload, state) };
    case SET_FIELD_PROPERTY:
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.fieldId]: setFieldproperty(state.fields[action.payload.fieldId], action.payload)
        }
      };
    case SET_FIELD_VALIDATOR:
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.fieldId]: changeValidator(state.fields[action.payload.fieldId], action.payload)
        }
      };
    default:
      return state;
  }
};

export default builderReducer;
