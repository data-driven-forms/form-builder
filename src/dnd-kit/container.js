import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';

const Container = ({ id, style, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const { setNodeRef: topSetNodeRef } = useDroppable({
    id: `voidzone-top-${id}`,
  });
  const { setNodeRef: botSetNodeRef } = useDroppable({
    id: `voidzone-bot-${id}`,
  });

  const innerStylestyle = {
    color: isOver ? 'green' : undefined,
    width: '100%',
    minHeight: 600,
    ...style,
  };

  const voidzoneStyle = {
    padding: 4,
    background: 'black',
  };

  return (
    <div style={{ width: '100%' }}>
      <div id={`voidzone-top-${id}`} ref={topSetNodeRef} style={voidzoneStyle}></div>
      <div id={id} ref={setNodeRef} style={innerStylestyle}>
        {children}
      </div>
      <div id={`voidzone-bot-${id}`} ref={botSetNodeRef} style={voidzoneStyle}></div>
    </div>
  );
};

Container.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default Container;
