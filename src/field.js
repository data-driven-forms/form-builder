import React, { useContext, Fragment } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import ComponentsContext from './components-context';
import StoreContext from './store-context';
import MockFieldProvider from './mock-field-provider';

// const Handle = ({ dragHandleProps }) => (
//  <div {...dragHandleProps}>
//    Drag handler
//  </div>
// );

const Field = ({
  field: { clone, isContainer, ...field },
  index,
  shouldClone,
  disableDrag,
  disableDelete
}) => {
  const {
    componentMapper: { FieldActions, FieldLayout, ...rest }
  } = useContext(ComponentsContext);
  const {
    dispatch,
    state: { selectedComponent, draggingContainer, fields }
  } = useContext(StoreContext);
  const FieldComponent = rest[field.component];
  const input = { name: field.name };
  const meta = {};
  const formOptions = {
    renderForm: () => null
  };
  if (field.component === 'container-end') {
    return (
      <Draggable isDragDisabled draggableId={field.id} index={index}>
        {(provided) => (
          <div
            className={clsx('container-end', {
              hide: !!field.id.match(new RegExp(`^${draggingContainer}-end`))
            })}
            ref={provided.innerRef}
            {...provided.draggableProps}
          ></div>
        )}
      </Draggable>
    );
  }
  return (
    <Draggable isDragDisabled={disableDrag} draggableId={field.id} index={index}>
      {(provided, snapshot) => (
        <Fragment>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={clsx('task-container', {
              dragging: snapshot.isDragging,
              selected: selectedComponent === field.id,
              'is-container': isContainer,
              'in-container': field.container,
              hide:
                field.container !== undefined &&
                field.container === draggingContainer
            })}
          >
            <FieldLayout>
              {field.preview ? (
                <div>{field.content}</div>
              ) : (
                <FieldComponent
                  {...field}
                  snapshot={snapshot}
                  FieldProvider={MockFieldProvider}
                  input={input}
                  meta={meta}
                  formOptions={formOptions}
                />
              )}
              {!shouldClone && (
                <FieldActions
                  onDelete={
                    disableDelete
                      ? undefined
                      : () =>
                          dispatch({ type: 'removeComponent', payload: field.id })
                  }
                  onSelect={() =>
                    dispatch({ type: 'setSelectedComponent', payload: field.id })
                  }
                  fieldData={field}
                />
              )}
            </FieldLayout>
          </div>
        </Fragment>
      )}
    </Draggable>
  );
};

export default Field;
