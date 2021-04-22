import { DndContext, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import React, { useReducer } from 'react';
import backend, { addItem, initialState, MAIN_CONTAINER, setActiveId, sortItems } from './backend';
import Container from './container';
import DraggableSource from './draggable-source';
import { BuilderProvider } from './builder-context';
import ItemsRendererConnector from './ItemsRenderer';

const DndKit = ({ components, pickerMapper }) => {
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

  const {
    [MAIN_CONTAINER]: { children: tree },
  } = containers;

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
    <BuilderProvider value={{ templates, containers, fields, pickerMapper }}>
      <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <DraggableSource templates={Object.values(templates)} />
          <Container style={{ background: 'tomato', padding: 40 }} id={MAIN_CONTAINER}>
            <SortableContext items={tree} strategy={rectSortingStrategy}>
              <ItemsRendererConnector items={tree} />
            </SortableContext>
          </Container>
        </div>
      </DndContext>
    </BuilderProvider>
  );
};

DndKit.propTypes = {
  components: PropTypes.arrayOf(PropTypes.shape({ component: PropTypes.string.isRequired, isContainer: PropTypes.bool })).isRequired,
  pickerMapper: PropTypes.shape({ [PropTypes.string]: PropTypes.elementType }).isRequired,
};

export default DndKit;
