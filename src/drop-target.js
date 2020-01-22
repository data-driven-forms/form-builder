import React, { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import Field from './field';
import ComponentsContext from './components-context';

const DropTarget = ({
  dropTarget,
  fields,
  isDropDisabled,
  shouldClone,
  disableDrag,
  disableDelete
}) => {
  const {
    componentMapper: { FormContainer }
  } = useContext(ComponentsContext);
  return (
    <Droppable droppableId={dropTarget.id} isDropDisabled={isDropDisabled}>
      {(provided, snapshot) => {
        return (
          <FormContainer className="container form-preview">
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={clsx('task-list', {
                dragging: snapshot.isDraggingOver
              })}
            >
              {fields.map((field, index) => (
                <Field
                  disableDrag={disableDrag}
                  disableDelete={disableDelete && field.restricted}
                  shouldClone={shouldClone}
                  key={field.id}
                  field={field}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          </FormContainer>
        );
      }}
    </Droppable>
  );
};

export default DropTarget;
