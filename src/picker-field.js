import React, { useContext, Fragment } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import ComponentsContext from './components-context';
import StoreContext from './store-context';

const PickerField = ({ field, index }) => {
  const { pickerMapper } = useContext(ComponentsContext);
  const Component = pickerMapper[field.component];
  return (
    <Draggable draggableId={field.id} index={index}>
      {(provided, snapshot) => (
        <Fragment>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Component {...snapshot} />
          </div>
          {snapshot.isDragging && (
            <Component />
          )}
        </Fragment>
      )}
    </Draggable>
  );
};

export default PickerField;
