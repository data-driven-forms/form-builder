import { DndContext, KeyboardSensor, PointerSensor, closestCorners, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Form from '@data-driven-forms/react-form-renderer/form';
import RendererContext from '@data-driven-forms/react-form-renderer/renderer-context';
import React, { useReducer } from 'react';
import backend, {
  addItem,
  initialState,
  removeComponent,
  setActiveId,
  setFieldProperty,
  setFieldValidator,
  setSelectedComponent,
  sortItems,
  setContainerChildren,
  addSubcontainer,
} from './backend';
import { BuilderProvider } from './builder-context';
import BuilderLayout from './builder-layout';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

import ItemsRendererConnector from './ItemsRenderer';

const DndKit = ({ components, pickerMapper, children, render, componentMapper, builderMapper, componentProperties, propertiesMapper }) => {
  const [{ templates, containers, fields, selectedComponent }, dispatch] = useReducer(backend, {
    ...initialState,
    templates: components.reduce((acc, curr) => ({ ...acc, [`template-${curr.component}`]: { ...curr, id: `template-${curr.component}` } }), {}),
    componentProperties,
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const bindSetActiveId = (id) => dispatch(setActiveId(id));
  const bindSortItems = (...args) => dispatch(sortItems(...args));
  const bindetSelectedComponent = (id) => dispatch(setSelectedComponent(id));
  const bindRemoveComponent = (id) => dispatch(removeComponent(id));
  const bindSetFieldProperty = (id, propertyName, value, dataType) => dispatch(setFieldProperty(id, propertyName, value, dataType));
  const bindSetFieldValidator = (id, value, index, action) => dispatch(setFieldValidator(id, value, index, action));
  const bindSetContainerChildren = (...args) => dispatch(setContainerChildren(...args));
  const bindAddSubcontainer = (...args) => dispatch(addSubcontainer(...args));

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
          value={{
            validatorMapper: Object.values(validatorTypes).reduce(
              (acc, curr) => ({
                ...acc,
                [curr]: () => () => undefined,
              }),
              {}
            ),
            formOptions: {
              internalRegisterField: () => null,
              renderForm: (items) => <ItemsRendererConnector items={items} />,
              internalUnRegisterField: () => null,
            },
          }}
        >
          <BuilderProvider
            value={{
              selectComponent: bindetSelectedComponent,
              selectedComponent,
              builderMapper,
              templates,
              containers,
              fields,
              pickerMapper,
              componentMapper,
              componentProperties,
              propertiesMapper,
              removeComponent: bindRemoveComponent,
              setFieldProperty: bindSetFieldProperty,
              setFieldValidator: bindSetFieldValidator,
              setContainerChildren: bindSetContainerChildren,
              addSubcontainer: bindAddSubcontainer,
            }}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={(rects, rect) => {
                const trashRect = rects.filter(([id]) => id === 'trash');
                const intersectingTrashRect = rectIntersection(trashRect, rect);

                if (intersectingTrashRect) {
                  return intersectingTrashRect;
                }

                const otherRects = rects.filter(([id]) => id !== 'trash');

                return closestCorners(otherRects, rect);
              }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
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
  builderMapper: PropTypes.shape({ [PropTypes.string]: PropTypes.elementType }).isRequired,
  componentProperties: PropTypes.shape({
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        component: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        propertyName: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  propertiesMapper: PropTypes.object.isRequired,
};

export default DndKit;
