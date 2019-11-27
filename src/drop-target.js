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
}) => {
  const { componentMapper: { BuilderColumn } } = useContext(ComponentsContext);
  return (
    <Droppable
      droppableId={dropTarget.id}
      isDropDisabled={isDropDisabled}
    >
      {(provided, snapshot) => (
        <BuilderColumn className="container">
          <h3 className="title">
            {dropTarget.title}
          </h3>
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx('task-list', {
              dragging: snapshot.isDraggingOver,
            })}
          >
            {fields.map((field, index) => (
              <Field
                shouldClone={shouldClone}
                key={field.id}
                field={field}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        </BuilderColumn>
      )}
    </Droppable>
  );
};

export default DropTarget;
