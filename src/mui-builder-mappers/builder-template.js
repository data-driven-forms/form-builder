import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const Root = styled('div')(() => ({
  '&.root': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  '& .builderLayout': {
    display: 'flex',
    flexGrow: 1,
  },
}));

const BuilderTemplate = ({ ComponentPicker, PropertiesEditor, DropTarget, children }) => (
  <Root className="root">
    {children}
    <div className="builderLayout">
      <ComponentPicker />
      <DropTarget key="drop-target" />
      <PropertiesEditor />
    </div>
  </Root>
);

BuilderTemplate.propTypes = {
  ComponentPicker: PropTypes.func.isRequired,
  PropertiesEditor: PropTypes.func.isRequired,
  DropTarget: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};

export default BuilderTemplate;
