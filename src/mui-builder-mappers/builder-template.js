import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  builderLayout: {
    display: 'flex',
    flexGrow: 1,
  },
});

const BuilderTemplate = ({ ComponentPicker, PropertiesEditor, DropTarget, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {children}
      <div className={classes.builderLayout}>
        <ComponentPicker />
        <DropTarget key="drop-target" />
        <PropertiesEditor />
      </div>
    </div>
  );
};

BuilderTemplate.propTypes = {
  ComponentPicker: PropTypes.func.isRequired,
  PropertiesEditor: PropTypes.func.isRequired,
  DropTarget: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};

export default BuilderTemplate;
