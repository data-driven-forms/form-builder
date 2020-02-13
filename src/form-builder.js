import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import DropTarget from './drop-target';
import PropertiesEditor from './properties-editor';
import ComponentPicker from './component-picker';
import { INITIALIZE } from './builder-state/builder-reducer';
import createSchema, { validateOutput } from './helpers/create-export-schema';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import './style.css';

const throttleValidator = throttle(validateOutput, 250);

const COMPONENTS_LIST = 'components-list';
const FORM_LAYOUT = 'form-layout';

const FormBuilder = ({ initialFields, disableDrag, mode, controlPanel, controlPanelPosition, classNamePrefix }) => {
  const getSchema = () => createSchema(state.fields);
  const dispatch = useDispatch();
  const state = useSelector((state) => state, shallowEqual);
  useEffect(() => {
    dispatch({ type: INITIALIZE, payload: initialFields });
  }, []);

  const onDragEnd = (result) => dispatch({ type: 'setColumns', payload: result });
  const onDragStart = (draggable) => dispatch({ type: 'dragStart', payload: draggable });
  const { dropTargets, fields, selectedComponent } = state;
  const Controls = controlPanel;
  if (!state.initialized) {
    return <div>Loading</div>;
  }
  return (
    <div className={`${classNamePrefix}__form-builder-container`}>
      {controlPanelPosition === 'top' && (
        <Controls className={`${classNamePrefix}__form-builder-controls`} getSchema={getSchema} isValid={throttleValidator(state.fields)} />
      )}
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className={`${classNamePrefix}__form-builder-layout`}>
          {!disableDrag && (
            <ComponentPicker
              isDropDisabled
              shouldClone
              dropTarget={dropTargets[COMPONENTS_LIST]}
              fields={dropTargets[COMPONENTS_LIST].fieldsIds.map((taskId) => fields[taskId])}
            />
          )}
          <DropTarget
            disableDrag={disableDrag}
            dropTarget={dropTargets[FORM_LAYOUT]}
            disableDelete={mode === 'subset'}
            fields={dropTargets[FORM_LAYOUT].fieldsIds.map((taskId) => fields[taskId])}
          />
          {selectedComponent && <PropertiesEditor />}
        </div>
      </DragDropContext>
      {controlPanelPosition === 'bottom' && (
        <Controls className={`${classNamePrefix}__form-builder-controls`} getSchema={getSchema} isValid={throttleValidator(state.fields)} />
      )}
    </div>
  );
};

FormBuilder.propTypes = {
  controlPanel: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func]).isRequired,
  controlPanelPosition: PropTypes.oneOf(['top', 'bottom']),
  classNamePrefix: PropTypes.string.isRequired,
  initialFields: PropTypes.object,
  disableDrag: PropTypes.bool,
  mode: PropTypes.string.isRequired
};

FormBuilder.defaultProps = {
  controlPanelPosition: 'top'
};

export default FormBuilder;
