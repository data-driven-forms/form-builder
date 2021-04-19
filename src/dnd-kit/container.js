import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';

const Container = ({ id, style, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const innerStylestyle = {
    color: isOver ? 'green' : undefined,
    width: '100%',
    minHeight: 600,
    ...style,
  };

  return (
    <div id={id} ref={setNodeRef} style={innerStylestyle}>
      {children}
    </div>
  );
};

Container.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default Container;
