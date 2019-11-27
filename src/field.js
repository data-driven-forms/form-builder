import React, { useContext, Fragment } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import ComponentsContext from './components-context';
import StoreContext from './store-context';


// const Handle = ({ dragHandleProps }) => (
//  <div {...dragHandleProps}>
//    Drag handler
//  </div>
// );

const Field = ({ field, index, shouldClone }) => {
  const { FieldActions } = useContext(ComponentsContext);
  const { dispatch } = useContext(StoreContext);
  return (
    <Draggable draggableId={field.id} index={index}>
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
            {field.content}
            {!shouldClone && (
              <FieldActions
                onDelete={() => dispatch({ type: 'removeComponent', payload: field.id })}
                onSelect={() => dispatch({ type: 'setSelectedComponent', payload: field.id })}
                fieldData={field}
              />
            )}
          </div>
          {shouldClone && snapshot.isDragging && (
            <div className="task-container">{field.content}</div>
          )}
        </Fragment>
      )}
    </Draggable>
  );
};

export default Field;
