import React from 'react';
import PropTypes from 'prop-types';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableContainer = ({ id, isActive, style, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const internalStyle = {
    padding: 16,
    background: 'tomato',
    color: 'white',
    margin: 8,
    visibility: isActive ? 'hidden' : undefined,
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div id={id} ref={setNodeRef} style={internalStyle} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

SortableContainer.propTypes = {
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default SortableContainer;
