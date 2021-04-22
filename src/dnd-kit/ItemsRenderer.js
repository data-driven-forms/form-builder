import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import BuilderContext from './builder-context';
import SortableItem from './sortable-item';
import SortableContainer from './sortable-container';

const ItemsRenderer = memo(
  ({ items, containers, fields, componentMapper }) => {
    return items.map((id) => {
      if (!fields[id]) {
        return null;
      }
      const field = fields[id];
      const Component = componentMapper[field.component];
      return <SingleItem key={id} containers={containers} Component={Component} {...field} />;
    });
  },
  (prev, next) => isEqual(prev, next)
);

ItemsRenderer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  fields: PropTypes.shape({ [PropTypes.string]: PropTypes.shape({ id: PropTypes.string.isRequired, isContainer: PropTypes.bool }) }).isRequired,
  containers: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  }).isRequired,
  componentMapper: PropTypes.shape({ [PropTypes.string]: PropTypes.elementType }).isRequired,
};

function SingleItem({ id, isContainer, containers, Component }) {
  if (!isContainer) {
    return (
      <SortableItem id={id}>
        <Component name={id} />
      </SortableItem>
    );
  }

  const items = containers[id].children;
  return (
    <SortableContainer id={id}>
      <h1 style={{ marginBottom: 16 }}>I am a container {id}</h1>
      <div style={{ padding: 16 }}>
        <b>Not ready yet</b>
        <Component fields={[]} name={id} />
        <ItemsRendererConnector items={items} />
      </div>
    </SortableContainer>
  );
}

SingleItem.propTypes = {
  id: PropTypes.string.isRequired,
  isContainer: PropTypes.bool,
  containers: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  }).isRequired,
  Component: PropTypes.elementType.isRequired,
};

function ItemsRendererConnector({ items }) {
  const { containers, fields, componentMapper } = useContext(BuilderContext);
  return <ItemsRenderer items={items} fields={fields} containers={containers} componentMapper={componentMapper} />;
}

ItemsRendererConnector.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ItemsRendererConnector;
