import React, { useContext, Fragment } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ComponentsContext from './components-context';
import MockFieldProvider from './mock-field-provider';

const PickerField = ({ field, index }) => {
  const { pickerMapper, componentMapper } = useContext(ComponentsContext);
  const Component = pickerMapper[field.component];
  const Clone = componentMapper[field.component];
  return (
    <Draggable draggableId={field.id} index={index}>
      {(provided, snapshot) => (
        <Fragment>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {snapshot.isDragging && field.clone
              ? <Clone input={{ name: 'template-clone' }} FieldProvider={MockFieldProvider} meta={{}} name="template-clone" snapshot={{ ...snapshot, isClone: true }} />
              : <Component {...snapshot} />}
          </div>
          {snapshot.isDragging && (
          <Component {...snapshot} />
          )}
        </Fragment>
      )}
    </Draggable>
  );
};

export default PickerField;
