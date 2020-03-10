import React, { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import ComponentsContext from './components-context';
import PickerField from './picker-field';
import { COMPONENTS_LIST } from './helpers/create-initial-data';
import { useSelector } from 'react-redux';
import { ComponentPickerContext } from './layout-context';

const ComponentPicker = () => {
  const {
    componentMapper: { BuilderColumn },
    classNamePrefix
  } = useContext(ComponentsContext);
  const { fields, disableAdd } = useContext(ComponentPickerContext);
  const dropTargetId = useSelector(({ dropTargets }) => dropTargets[COMPONENTS_LIST].id);
  const dropTargetTitle = useSelector(({ dropTargets }) => dropTargets[COMPONENTS_LIST].title);

  if (disableAdd) {
    return null;
  }
  return (
    <Droppable droppableId={dropTargetId} isDropDisabled>
      {(provided, snapshot) => (
        <BuilderColumn className={`${classNamePrefix}__component-picker-container`}>
          <h3 className="title">{dropTargetTitle}</h3>
          <div
            ref={provided.innerRef}
            className={clsx(`${classNamePrefix}__picker-list`, {
              dragging: snapshot.isDraggingOver
            })}
          >
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
