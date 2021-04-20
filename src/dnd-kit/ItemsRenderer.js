import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import BuilderContext from './builder-context';
import SortableItem from './sortable-item';
import SortableContainer from './sortable-container';

const ItemsRenderer = memo(
  ({ items, containers, fields }) => {
    return items.map((id) => {
      if (!fields[id]) {
        return null;
      }
      return <SingleItem key={id} containers={containers} {...fields[id]} />;
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
};

function SingleItem({ id, isContainer, containers }) {
  if (!isContainer) {
    return <SortableItem id={id} />;
  }

  const items = containers[id].children;
  return (
    <SortableContainer id={id}>
      <h1>I am a container {id}</h1>
      <div style={{ padding: 16 }}>
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
};

function ItemsRendererConnector({ items }) {
  const { containers, fields } = useContext(BuilderContext);
  return <ItemsRenderer items={items} fields={fields} containers={containers} />;
}

ItemsRendererConnector.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ItemsRendererConnector;
