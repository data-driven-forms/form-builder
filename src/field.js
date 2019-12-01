import React, { useContext, Fragment } from "react";
import { Draggable } from "react-beautiful-dnd";
import clsx from "clsx";
import ComponentsContext from "./components-context";
import StoreContext from "./store-context";
import MockFieldProvider from "./mock-field-provider";

// const Handle = ({ dragHandleProps }) => (
//  <div {...dragHandleProps}>
//    Drag handler
//  </div>
// );

const Field = ({ field: { clone, ...field }, index, shouldClone }) => {
  const {
    componentMapper: { FieldActions, FieldLayout, ...rest }
  } = useContext(ComponentsContext);
  const { dispatch } = useContext(StoreContext);
  const FieldComponent = rest[field.component];
  const input = { name: field.name };
  const meta = {};
  return (
    <Draggable draggableId={field.id} index={index}>
      {(provided, snapshot) => (
        <Fragment>
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={clsx("task-container", {
              dragging: snapshot.isDragging
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
                />
              )}
              {!shouldClone && (
                <FieldActions
                  onDelete={() =>
                    dispatch({ type: "removeComponent", payload: field.id })
                  }
                  onSelect={() =>
                    dispatch({ type: "setSelectedComponent", payload: field.id })
                  }
                  fieldData={field}
                />
              )}
            </FieldLayout>
          </div>
          {shouldClone && snapshot.isDragging && (
            <div className='task-container'>{field.content}</div>
          )}
        </Fragment>
      )}
    </Draggable>
  );
};

export default Field;
