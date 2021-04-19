import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Item = forwardRef(({ children, ...props }, ref) => {
  return (
    <div style={{ padding: 16, background: 'blue' }} {...props} ref={ref}>
      {children}
    </div>
  );
});

Item.propTypes = {
  children: PropTypes.node,
};

export default Item;
