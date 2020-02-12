import React, { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import ComponentsContext from './components-context';
import PickerField from './picker-field';

const ComponentPicker = ({ dropTarget, fields }) => {
  const {
    componentMapper: { BuilderColumn },
    classNamePrefix
  } = useContext(ComponentsContext);
  return (
    <Droppable droppableId={dropTarget.id} isDropDisabled>
      {(provided, snapshot) => (
        <BuilderColumn className={`${classNamePrefix}__component-picker-container`}>
          <h3 className="title">{dropTarget.title}</h3>
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

ComponentPicker.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ).isRequired,
  dropTarget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired
};

export default ComponentPicker;
