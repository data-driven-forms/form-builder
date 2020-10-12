import React from 'react';
import PropTypes from 'prop-types';

const BuilderTemplate = ({ ComponentPicker, PropertiesEditor, DropTarget, children }) => (
  <div className="pf4-form-builder-layout-template">
    {children}
    <div className="pf4-form-builder-components">
      <ComponentPicker />
      <DropTarget key="drop-target" />
      <PropertiesEditor />
    </div>
  </div>
);

BuilderTemplate.propTypes = {
  ComponentPicker: PropTypes.func.isRequired,
  PropertiesEditor: PropTypes.func.isRequired,
  DropTarget: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};

export default BuilderTemplate;
