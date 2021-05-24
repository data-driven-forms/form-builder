import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Fragment } from 'react';
import { useDroppable } from '@dnd-kit/core';
import BuilderContext from './builder-context';

const SortableContainer = ({ disableDrag, disableDrop, id, isActive, style, children }) => {
  const {
    selectComponent,
    selectedComponent,
    builderMapper: { DragHandle, ContainerLayout },
  } = useContext(BuilderContext);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled: disableDrag });
  const { isOver, setNodeRef: droppablSetNodeRef } = useDroppable({
    disabled: disableDrop,
    id,
  });
  const { isOver: topIsOver, setNodeRef: topSetNodeRef } = useSortable({
    id: `voidzone-top-${id}`,
  });
  const { isOver: botIsIver, setNodeRef: botSetNodeRef } = useSortable({
    id: `voidzone-bot-${id}`,
  });

  const internalStyle = {
    padding: 24,
    background: isOver ? 'green' : 'inherit',
    margin: 8,
    visibility: isActive ? 'hidden' : undefined,
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const voidzoneStyle = {
    padding: 4,
    margin: 4,
    background: 'black',
  };

  return (
    <ContainerLayout selected={selectedComponent === id}>
      <div>
        <div id={`voidzone-top-${id}`} ref={topSetNodeRef} style={voidzoneStyle}></div>
        <div id={id} ref={setNodeRef} style={internalStyle} {...attributes}>
          <div
            id={`droppable-${id}`}
            onClick={(event) => {
              event.stopPropagation();
              selectComponent(id);
            }}
            style={{ paddingTop: 8, paddingBottom: 8 }}
            ref={droppablSetNodeRef}
          >
            {children}
          </div>
        </div>
        <div id={`voidzone-bot-${id}`} ref={botSetNodeRef} style={voidzoneStyle}></div>
      </div>
      {!disableDrag && <DragHandle dragHandleProps={listeners} />}
    </ContainerLayout>
  );
};

SortableContainer.propTypes = {
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default SortableContainer;
