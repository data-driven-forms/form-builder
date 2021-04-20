import React from 'react';
import PropTypes from 'prop-types';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Fragment } from 'react';
import { useDroppable } from '@dnd-kit/core';

const SortableContainer = ({ id, isActive, style, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const { isOver, setNodeRef: droppablSetNodeRef } = useDroppable({
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
    background: isOver ? 'green' : 'tomato',
    color: 'white',
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
    <Fragment>
      <div id={`voidzone-top-${id}`} ref={topSetNodeRef} style={voidzoneStyle}></div>
      <div id={id} ref={setNodeRef} style={internalStyle} {...attributes} {...listeners}>
        <div id={`droppable-${id}`} style={{ paddingTop: 8, paddingBottom: 8 }} ref={droppablSetNodeRef}>
          {children}
        </div>
      </div>
      <div id={`voidzone-bot-${id}`} ref={botSetNodeRef} style={voidzoneStyle}></div>
    </Fragment>
  );
};

SortableContainer.propTypes = {
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default SortableContainer;
