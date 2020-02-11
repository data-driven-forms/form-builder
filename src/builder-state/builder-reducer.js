import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import propertiesValidation from '../properties-editor/initial-value-checker';

const isInContainer = (index, containers) => {
  const containerKey = Object.keys(containers).filter(
    (c) =>
      index > containers[c].boundaries[0] && index <= containers[c].boundaries[1]
  );
  return containerKey ? containers[containerKey] : false;
};

const mutateColumns = (result, state) => {
  const { destination, source, draggableId } = result;
  const { dropTargets, fields, containers } = state;
  if (!destination) {
    return {};
  }

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return {};
  }

  const start = dropTargets[source.droppableId];
  const finish = dropTargets[destination.droppableId];
  const template = fields[draggableId];
  /**
   * moving in column
   */
  if (start === finish) {
    if (template.isContainer && isInContainer(destination.index, containers)) {
      /**
       * No container nesting just now
       */
      return;
    }
    if (template.isContainer) {
      const newFieldsIds = [...start.fieldsIds];
      newFieldsIds.splice(source.index, template.children.length + 2);
      newFieldsIds.splice(
        destination.index,
        0,
        draggableId,
        ...template.children,
        `${draggableId}-end`
      );
      return {
        dropTargets: {
          ...dropTargets,
          [source.droppableId]: { ...start, fieldsIds: newFieldsIds }
        }
      };
    } else {
      const newFieldsIds = [...start.fieldsIds];
      const moveContainer = isInContainer(destination.index, containers);
      const newFields = { ...fields };
      /**
       * Move into from root
       * filed was not in container before
       */
      if (moveContainer && !fields[draggableId].container) {
        newFields[moveContainer.id].children = [
          ...newFields[moveContainer.id].children,
          draggableId
        ];
        newFields[draggableId].container = moveContainer.id;
      }
      /**
       * Move field outside of a container to root
       */
      if (fields[draggableId].container && !moveContainer) {
        newFields[fields[draggableId].container].children = newFields[
          fields[draggableId].container
        ].children.filter((child) => child !== draggableId);
        delete newFields[draggableId].container;
      }
      /**
       * Move field between containers
       */
      if (
        moveContainer &&
        fields[draggableId].container &&
        fields[draggableId].container !== moveContainer.id
      ) {
        newFields[moveContainer.id].children = [
          ...newFields[moveContainer.id].children,
          draggableId
        ];
        newFields[fields[draggableId].container].children = newFields[
          fields[draggableId].container
        ].children.filter((child) => child !== draggableId);
        newFields[draggableId].container = moveContainer.id;
      }
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
  }
  /**
   * Copy to column
   */

  const newId = Date.now().toString();
  const finishFieldsIds = [...finish.fieldsIds];
  const container = isInContainer(destination.index, containers);

  const newFields = {
    ...fields,
    [newId]: {
      ...fields[draggableId],
      name: fields[draggableId].component,
      preview: false,
      id: newId,
      initialized: false,
      container: container && container.id,
      children: template.isContainer && []
    }
  };
  let newContainers = [...containers];
  if (container) {
    newFields[container.id] = {
      ...newFields[container.id],
      children: [...newFields[container.id].children, newId]
    };
    newContainers = newContainers.map((c) =>
      c.id === container.id
        ? { ...c, boundaries: [c.boundaries[0], c.boundaries[1] + 1] }
        : c
    );
  }
  if (template.isContainer) {
    finishFieldsIds.splice(destination.index, 0, newId, `${newId}-end`);
    newFields[`${newId}-end`] = {
      component: 'container-end',
      id: `${newId}-end`
    };
    newContainers.push({
      id: newId,
      boundaries: [destination.index, destination.index + 1]
    });
  } else {
    finishFieldsIds.splice(destination.index, 0, newId);
  }
  const newFinish = {
    ...finish,
    fieldsIds: finishFieldsIds
  };
  return {
    dropTargets: { ...dropTargets, [newFinish.id]: newFinish },
    fields: newFields,
    selectedComponent: newId,
    containers: newContainers
  };
};

const removeComponent = (componentId, state) => {
  const { fields } = state;
  const field = { ...fields[componentId] };
  let containers = [...state.containers];
  if (field.container) {
    /**
     * adjust container size if field was in container
     */
    containers = containers.map((c) =>
      c.id === field.container
        ? { ...c, boundaries: [c.boundaries[0], c.boundaries[1] - 1] }
        : c
    );
  }
  delete fields[componentId];
  delete fields[`${componentId}-end`];
  return {
    selectedComponent: undefined,
    dropTargets: {
      ...state.dropTargets,
      [FORM_LAYOUT]: {
        ...state.dropTargets[FORM_LAYOUT],
        fieldsIds: state.dropTargets[FORM_LAYOUT].fieldsIds.filter(
          (id) => id !== componentId && id !== `${componentId}-end`
        )
      }
    },
    fields: { ...state.fields },
    containers
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

const dragStart = (field, state) => {
  if (
    field.draggableId.match(/^initial-/) ||
    !state.fields[field.draggableId].isContainer
  ) {
    return {};
  }
  return { draggingContainer: field.draggableId };
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
    result.validate = validate.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...validator } : item
    );
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
  switch (action.type) {
    case INITIALIZE:
      return { ...state, ...action.payload, initialized: true };
    case SET_COLUMNS:
      return {
        ...state,
        ...mutateColumns(action.payload, state),
        draggingContainer: undefined
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
          [action.payload.fieldId]: setFieldproperty(
            state.fields[action.payload.fieldId],
            action.payload
          )
        }
      };
    case SET_FIELD_VALIDATOR:
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.fieldId]: changeValidator(
            state.fields[action.payload.fieldId],
            action.payload
          )
        }
      };
    default:
      return state;
  }
};

export default builderReducer;
