import React from 'react';
import PropTypes from 'prop-types';
import { useDraggable } from '@dnd-kit/core';

const Draggable = ({ id, style, ...props }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const innerStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <span ref={setNodeRef} style={{ ...style, ...innerStyle }} {...listeners} {...attributes}>
      {props.children}
    </span>
  );
};
Draggable.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default Draggable;
