import React, { Fragment } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';

// const Handle = ({ dragHandleProps }) => (
//  <div {...dragHandleProps}>
//    Drag handler
//  </div>
// );

const Field = ({ task, index, shouldClone }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided, snapshot) => (
      <Fragment>
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={clsx('task-container', {
            dragging: snapshot.isDragging,
          })}
        >
          {task.content}
        </div>
        {shouldClone && snapshot.isDragging && (
          <div className="task-container">{task.content}</div>
        )}
      </Fragment>
    )}
  </Draggable>
);

export default Field;
