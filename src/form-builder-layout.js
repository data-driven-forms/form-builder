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
import { DropTargetContext, ComponentPickerContext } from './layout-context';
import { COMPONENTS_LIST } from './helpers/create-initial-data';

const throttleValidator = throttle(validateOutput, 250);

const Layout = ({ getSchema, state, render, children }) => {
  const layoutProps = {
    getSchema,
    isValid: throttleValidator(state.fields),
    ComponentPicker,
    DropTarget,
    PropertiesEditor
  };
  if (render) {
    return render(layoutProps);
  }
  if (children && children.length > 1) {
    throw new Error('Form builder requires only one child node. Please wrap your childnre in a Fragment');
  }
  if (children) {
    return children(layoutProps);
  }

  throw new Error('Form builder requires either render prop or children');
};

const FormBuilderLayout = ({ initialFields, disableDrag, mode, disableAdd, children, render }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state, shallowEqual);
  useEffect(() => {
    dispatch({ type: INITIALIZE, payload: initialFields });
  }, []);
  const getSchema = () => createSchema(state.fields);

  const onDragEnd = (result) => dispatch({ type: 'setColumns', payload: result });
  const onDragStart = (draggable) => dispatch({ type: 'dragStart', payload: draggable });
  const { dropTargets, fields } = state;
  if (!state.initialized) {
    return <div>Loading</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <DropTargetContext.Provider
        value={{
          disableDrag
        }}
      >
        <ComponentPickerContext.Provider
          value={{
            fields: dropTargets[COMPONENTS_LIST].fieldsIds.map((taskId) => fields[taskId]),
            disableAdd
          }}
        >
          <Layout
            getSchema={getSchema}
            state={state}
            dropTargets={dropTargets}
            fields={fields}
            mode={mode}
            disableDrag={disableDrag}
            render={render}
            children={children}
          />
        </ComponentPickerContext.Provider>
      </DropTargetContext.Provider>
    </DragDropContext>
  );
};

FormBuilderLayout.propTypes = {
  initialFields: PropTypes.object,
  disableDrag: PropTypes.bool,
  mode: PropTypes.string.isRequired
};

export default FormBuilderLayout;
