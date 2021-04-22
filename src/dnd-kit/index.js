import { DndContext, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Form from '@data-driven-forms/react-form-renderer/form';
import RendererContext from '@data-driven-forms/react-form-renderer/renderer-context';
import React, { useReducer } from 'react';
import backend, { addItem, initialState, setActiveId, sortItems } from './backend';
import { BuilderProvider } from './builder-context';
import BuilderLayout from './builder-layout';

const DndKit = ({ components, pickerMapper, children, render, componentMapper }) => {
  const [{ templates, containers, fields }, dispatch] = useReducer(backend, {
    ...initialState,
    templates: components.reduce((acc, curr) => ({ ...acc, [`template-${curr.component}`]: { ...curr, id: `template-${curr.component}` } }), {}),
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const bindSetActiveId = (id) => dispatch(setActiveId(id));
  const bindSortItems = (...args) => dispatch(sortItems(...args));

  const handleDragStart = (event) => {
    const { active } = event;
    bindSetActiveId(active.id);
  };

  const handleAddItem = (id, over) => dispatch(addItem(id, over));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active?.id.match(/^template-/)) {
      handleAddItem(active.id, over.id);
    } else if (active.id !== over.id) {
      bindSortItems(active.id, over.id);
    }

    bindSetActiveId(null);
  };

  return (
    <Form onSubmit={() => undefined}>
      {() => (
        <RendererContext.Provider
          value={{ formOptions: { internalRegisterField: () => null, renderForm: () => null, internalUnRegisterField: () => null } }}
        >
          <BuilderProvider value={{ templates, containers, fields, pickerMapper, componentMapper }}>
            <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <BuilderLayout render={render}>{children}</BuilderLayout>
              </div>
            </DndContext>
          </BuilderProvider>
        </RendererContext.Provider>
      )}
    </Form>
  );
};

DndKit.propTypes = {
  components: PropTypes.arrayOf(PropTypes.shape({ component: PropTypes.string.isRequired, isContainer: PropTypes.bool })).isRequired,
  pickerMapper: PropTypes.shape({ [PropTypes.string]: PropTypes.elementType }).isRequired,
  children: PropTypes.func,
  render: PropTypes.func,
  componentMapper: PropTypes.shape({ [PropTypes.string]: PropTypes.elementType }).isRequired,
};

export default DndKit;
