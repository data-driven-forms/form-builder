import React, { useReducer, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import DropTarget from './drop-target';
import StoreContext from './store-context';
import PropertiesEditor from './properties-editor';
import ComponentPicker from './component-picker';
import './style.css';

const COMPONENTS_LIST = 'components-list';
const FORM_LAYOUT = 'form-layout';

const propertyStrings = {
  isRequired: 'required',
  isDisabled: 'disabled',
  isReadOnly: 'read only',
  hideField: 'hidden'
};

const initialValueCheckMessage = ({ isDisabled, isReadOnly, hideField }) => {
  return `Initial value must be set if field is required and at the same time ${Object.entries(
    {
      isDisabled,
      isReadOnly,
      hideField
    }
  )
    .filter(([, value]) => value)
    .map(([key]) => propertyStrings[key])
    .join(' or ')}.`;
};

const initialValueCheck = ({
  initialValue,
  isRequired,
  isDisabled,
  isReadOnly,
  hideField
}) =>
  !initialValue && isRequired && (isDisabled || isReadOnly || hideField)
    ? {
        initialValue: {
          message: initialValueCheckMessage({
            isDisabled,
            isReadOnly,
            hideField
          }),
          code: 'errors.initialValue',
          codeDependencies: {
            isRequired,
            isDisabled,
            isReadOnly,
            hideField
          }
        }
      }
    : {
        initialValue: undefined
      };

const propertyValidationMapper = {
  isDisabled: initialValueCheck,
  isReadOnly: initialValueCheck,
  hideField: initialValueCheck,
  initialValue: initialValueCheck
};

const propertiesValidation = (type) => {
  const validation = propertyValidationMapper[type];
  return validation ? validation : () => ({});
};

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

const reducer = (state, action) => {
  switch (action.type) {
    case 'setColumns':
      return {
        ...state,
        ...mutateColumns(action.payload, state),
        draggingContainer: undefined
      };
    case 'setSelectedComponent':
      return { ...state, selectedComponent: action.payload };
    case 'removeComponent':
      return { ...state, ...removeComponent(action.payload, state) };
    case 'dragStart':
      return { ...state, ...dragStart(action.payload, state) };
    case 'setFieldProperty':
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
    case 'setFieldValidator':
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

const ARTIFICIAL_KEYS = [
  'preview',
  'clone',
  'initialized',
  'id',
  'isContainer',
  'children',
  'container',
  'restricted',
  'propertyValidation'
];

const sanitizeField = (field) => {
  const result = { ...field };
  ARTIFICIAL_KEYS.forEach((key) => {
    delete result[key];
  });
  if (result.options) {
    result.options = result.options
      .filter(({ deleted }) => !deleted)
      .map(({ restoreable, ...option }) => option);
  }
  return result;
};

const createSchema = (fields) => {
  const keys = Object.keys(fields).filter((key) => !key.match(/^initial-/));
  const invalid = Object.keys(fields).find(
    (key) =>
      fields[key].propertyValidation &&
      Object.keys(fields[key].propertyValidation).length > 0 &&
      Object.entries(fields[key].propertyValidation).find(([, value]) => value)
  );
  return [
    {
      fields: keys.map((key) => sanitizeField(fields[key]))
    },
    !invalid
  ];
};

const FormBuilder = ({ initialFields, onChange, disableDrag, mode }) => {
  const [state, dispatch] = useReducer(reducer, initialFields);

  useEffect(() => {
    onChange(...createSchema(state.fields));
  });

  const onDragEnd = (result) => dispatch({ type: 'setColumns', payload: result });
  const onDragStart = (draggable) =>
    dispatch({ type: 'dragStart', payload: draggable });
  const { dropTargets, fields, selectedComponent } = state;
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="layout">
          {!disableDrag && (
            <ComponentPicker
              isDropDisabled
              shouldClone
              dropTarget={dropTargets[COMPONENTS_LIST]}
              fields={dropTargets[COMPONENTS_LIST].fieldsIds.map(
                (taskId) => fields[taskId]
              )}
            />
          )}
          <DropTarget
            disableDrag={disableDrag}
            dropTarget={dropTargets[FORM_LAYOUT]}
            disableDelete={mode === 'subset'}
            fields={dropTargets[FORM_LAYOUT].fieldsIds.map(
              (taskId) => fields[taskId]
            )}
          />
          {selectedComponent && <PropertiesEditor />}
        </div>
      </DragDropContext>
    </StoreContext.Provider>
  );
};

export default FormBuilder;
