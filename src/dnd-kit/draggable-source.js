import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Draggable from './draggable';
import BuilderContext from './builder-context';

const DraggableSource = ({ templates, pickerMapper }) => (
  <div style={{ width: 200, display: 'flex', flexDirection: 'column' }}>
    {templates.map(({ id, component, ...rest }) => {
      const Component = pickerMapper[component];
      return (
        <Draggable id={id} key={id} {...rest}>
          <Component />
        </Draggable>
      );
    })}
  </div>
);

DraggableSource.propTypes = {
  templates: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  pickerMapper: PropTypes.shape({ [PropTypes.string]: PropTypes.elementType }).isRequired,
};

const DraggableSourceConnector = (props) => {
  const { pickerMapper } = useContext(BuilderContext);
  return <DraggableSource pickerMapper={pickerMapper} {...props} />;
};

export default DraggableSourceConnector;
