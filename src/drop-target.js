import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import Field from './field';

const DropTarget = ({
  dropTarget,
  fields,
  isDropDisabled,
  shouldClone,
}) => (
  <Droppable
    droppableId={dropTarget.id}
    isDropDisabled={isDropDisabled}
  >
    {(provided, snapshot) => (
      <div className="container">
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
      </div>
    )}
  </Droppable>
);

export default DropTarget;
