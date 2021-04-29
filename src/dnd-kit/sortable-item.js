import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Item from './item';
import BuilderContext from './builder-context';

const SortableItem = ({ children, ...props }) => {
  const {
    selectComponent,
    selectedComponent,
    builderMapper: { DragHandle, FieldLayout },
  } = useContext(BuilderContext);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: 16,
    width: '100%',
  };

  return (
    <Item
      ref={setNodeRef}
      style={style}
      onClick={(event) => {
        event.stopPropagation();
        selectComponent(props.id);
      }}
      {...attributes}
    >
      <FieldLayout selected={selectedComponent === props.id}>
        {children}
        <DragHandle dragHandleProps={listeners} />
      </FieldLayout>
    </Item>
  );
};

SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default SortableItem;
