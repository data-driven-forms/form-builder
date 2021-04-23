import React from 'react';
import PropTypes from 'prop-types';

import DraggableSource from './draggable-source';
import DropTarget from './drop-target';
import PropertiesEditor from './properties-editor';

const Layout = ({ render, children }) => {
  const layoutProps = {
    DraggableSource,
    DropTarget,
    PropertiesEditor,
  };
  if (render) {
    return render(layoutProps);
  }
  if (children && children.length > 1) {
    throw new Error('Form builder requires only one child node. Please wrap your children in a Fragment');
  }
  if (children) {
    return children(layoutProps);
  }

  throw new Error('Form builder requires either render prop or children');
};

const BuilderLayout = ({ children, render }) => {
  return <Layout render={render}>{children}</Layout>;
};

BuilderLayout.propTypes = {
  initialFields: PropTypes.object,
  disableDrag: PropTypes.bool,
  mode: PropTypes.string,
  children: PropTypes.func,
  render: PropTypes.func,
  disableAdd: PropTypes.bool,
};

export default BuilderLayout;
