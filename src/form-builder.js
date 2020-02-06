import React, { useReducer, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import DropTarget from './drop-target';
import StoreContext from './store-context';
import PropertiesEditor from './properties-editor';
import ComponentPicker from './component-picker';
import builderReducer from './builder-state/builder-reducer';
import createSchema from './helpers/create-export-schema';
import './style.css';

const COMPONENTS_LIST = 'components-list';
const FORM_LAYOUT = 'form-layout';

const FormBuilder = ({ initialFields, onChange, disableDrag, mode }) => {
  const [state, dispatch] = useReducer(builderReducer, initialFields);

  useEffect(() => {
    onChange(...createSchema(state.fields));
  });

  const onDragEnd = (result) => dispatch({ type: 'setColumns', payload: result });
  const onDragStart = (draggable) =>
    dispatch({ type: 'dragStart', payload: draggable });
  const { dropTargets, fields, selectedComponent } = state;
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="layout">
          {!disableDrag && (
            <ComponentPicker
              isDropDisabled
              shouldClone
              dropTarget={dropTargets[COMPONENTS_LIST]}
              fields={dropTargets[COMPONENTS_LIST].fieldsIds.map(
                (taskId) => fields[taskId]
              )}
            />
          )}
          <DropTarget
            disableDrag={disableDrag}
            dropTarget={dropTargets[FORM_LAYOUT]}
            disableDelete={mode === 'subset'}
            fields={dropTargets[FORM_LAYOUT].fieldsIds.map(
              (taskId) => fields[taskId]
            )}
          />
          {selectedComponent && <PropertiesEditor />}
        </div>
      </DragDropContext>
    </StoreContext.Provider>
  );
};

export default FormBuilder;
