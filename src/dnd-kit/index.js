import { closestCorners, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useReducer, useState } from 'react';
import backend, { addItem, initialState, MAIN_CONTAINER, setActiveId, setItems, sortItems } from './backend';
import Container from './container';
import DraggableSource from './draggable-source';
import Item from './item';
import SortableContainer from './sortable-container';
import SortableItem from './sortable-item';

const DndKit = () => {
  const [
    {
      containers: {
        [MAIN_CONTAINER]: { children: tree },
      },
      activeId,
    },
    dispatch,
  ] = useReducer(backend, initialState);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <DraggableSource />
        <Container style={{ background: 'tomato', padding: 40 }} id={MAIN_CONTAINER}>
          <SortableContext items={tree} strategy={verticalListSortingStrategy}>
            {tree.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </SortableContext>
          <DragOverlay>{activeId ? <Item id={activeId}>{activeId}</Item> : null}</DragOverlay>
        </Container>
      </div>
    </DndContext>
  );
};

export default DndKit;
