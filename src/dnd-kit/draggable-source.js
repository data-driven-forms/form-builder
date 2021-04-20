import React from 'react';
import PropTypes from 'prop-types';

import Draggable from './draggable';

const DraggableSource = ({ templates }) => (
  <div style={{ width: 200, display: 'flex', flexDirection: 'column' }}>
    {templates.map(({ id, component, ...rest }) => (
      <Draggable id={id} key={id} {...rest}>
        <button>{component}</button>
      </Draggable>
    ))}
  </div>
);

DraggableSource.propTypes = {
  templates: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
};

export default DraggableSource;
