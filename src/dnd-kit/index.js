import { closestCorners, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useReducer } from 'react';
import backend, { addItem, initialState, MAIN_CONTAINER, setActiveId, setItems, sortItems } from './backend';
import Container from './container';
import DraggableSource from './draggable-source';
import Item from './item';
import SortableItem from './sortable-item';
import { BuilderProvider } from './builder-context';
import ItemsRendererConnector from './ItemsRenderer';

const DndKit = ({ components }) => {
  const [{ templates, containers, activeId, fields }, dispatch] = useReducer(backend, {
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
  const bindSetItems = (items) => dispatch(setItems(items));
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

  console.log({ containers, tree });
  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <DraggableSource templates={Object.values(templates)} />
        <Container style={{ background: 'tomato', padding: 40 }} id={MAIN_CONTAINER}>
          <BuilderProvider value={{ templates, containers, fields }}>
            <SortableContext items={tree} strategy={verticalListSortingStrategy}>
              <ItemsRendererConnector items={tree} />
            </SortableContext>
            <DragOverlay>{activeId ? <Item id={activeId}>{activeId}</Item> : null}</DragOverlay>
          </BuilderProvider>
        </Container>
      </div>
    </DndContext>
  );
};

DndKit.propTypes = {
  components: PropTypes.arrayOf(PropTypes.shape({ component: PropTypes.string.isRequired, isContainer: PropTypes.bool })).isRequired,
};

export default DndKit;
