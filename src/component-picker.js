import React, { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import ComponentsContext from './components-context';
import PickerField from './picker-field';
import { COMPONENTS_LIST } from './helpers/create-initial-data';
import { useSelector } from 'react-redux';
import { ComponentPickerContext } from './layout-context';

const ComponentPicker = () => {
  const {
    builderMapper: { BuilderColumn }
  } = useContext(ComponentsContext);
  const { fields, disableAdd } = useContext(ComponentPickerContext);
  const dropTargetId = useSelector(({ dropTargets }) => dropTargets[COMPONENTS_LIST].id);

  if (disableAdd) {
    return null;
  }
  return (
    <Droppable droppableId={dropTargetId} isDropDisabled>
      {(provided, snapshot) => (
        <BuilderColumn isDraggingOver={snapshot.isDraggingOver}>
          <div ref={provided.innerRef}>
            {fields.map((field, index) => (
              <PickerField key={field.id} field={field} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </BuilderColumn>
      )}
    </Droppable>
  );
};

export default ComponentPicker;
