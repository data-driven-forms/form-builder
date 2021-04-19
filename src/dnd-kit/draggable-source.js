import React from 'react';
import Draggable from './draggable';

const avaiableItems = [
  { component: 'text-field', id: 'template-text-field' },
  { id: 'template-switch', component: 'switch' },
  { component: 'container', id: 'template-nested-cmp' },
];

const DraggableSource = () => (
  <div style={{ width: 200, display: 'flex', flexDirection: 'column' }}>
    {avaiableItems.map(({ id, component, ...rest }) => (
      <Draggable id={id} key={id} {...rest}>
        <button>{component}</button>
      </Draggable>
    ))}
  </div>
);

export default DraggableSource;
