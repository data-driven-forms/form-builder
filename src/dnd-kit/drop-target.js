import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { MAIN_CONTAINER } from './backend';
import Container from './container';
import ItemsRendererConnector from './ItemsRenderer';
import BuilderContext from './builder-context';

const DropTarget = ({ tree }) => (
  <Container style={{ background: 'tomato', padding: 40 }} id={MAIN_CONTAINER}>
    <SortableContext items={tree} strategy={rectSortingStrategy}>
      <ItemsRendererConnector items={tree} />
    </SortableContext>
  </Container>
);

DropTarget.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const DropTargetConnector = () => {
  const {
    containers: {
      [MAIN_CONTAINER]: { children: tree },
    },
  } = useContext(BuilderContext);
  return <DropTarget tree={tree} />;
};

export default DropTargetConnector;
