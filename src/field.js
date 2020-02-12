import React, { useContext, memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Field as FinalFormField } from 'react-final-form';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import ComponentsContext from './components-context';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

const Field = memo(
  ({
    field: { clone, isContainer, validate, ...field },
    index,
    shouldClone,
    disableDrag,
    selectedComponent,
    draggingContainer
  }) => {
    const {
      componentMapper: { FieldActions, FieldLayout, DragHandle, ...rest }
    } = useContext(ComponentsContext);
    const dispatch = useDispatch();
    const FieldComponent = rest[field.component];
    const formOptions = {
      renderForm: () => null
    };
    const hasPropertyError =
      field.propertyValidation &&
      Object.entries(field.propertyValidation).find(([, value]) => value);
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
    const { hideField, initialized, preview, restricted, ...cleanField } = field;
    return (
      <Draggable isDragDisabled={disableDrag} draggableId={field.id} index={index}>
        {(provided, snapshot) => {
          const innerProps = {
            snapshot: snapshot,
            hasPropertyError: !!hasPropertyError,
            hideField,
            initialized,
            preview,
            restricted
          };
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              onClick={() =>
                dispatch({ type: 'setSelectedComponent', payload: field.id })
              }
              className="draggable-container"
            >
              <div
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
                <FieldLayout disableDrag={disableDrag}>
                  {field.preview ? (
                    <div>{field.content}</div>
                  ) : (
                    <FinalFormField
                      {...cleanField}
                      component={FieldComponent}
                      FieldProvider={FinalFormField}
                      formOptions={formOptions}
                      innerProps={innerProps}
                    />
                  )}
                </FieldLayout>
                {!shouldClone && (
                  <DragHandle
                    disableDrag={disableDrag}
                    hasPropertyError={!!hasPropertyError}
                    dragHandleProps={{ ...provided.dragHandleProps }}
                  />
                )}
              </div>
            </div>
          );
        }}
      </Draggable>
    );
  }
);

Field.propTypes = {
  index: PropTypes.number.isRequired,
  shouldClone: PropTypes.bool,
  disableDrag: PropTypes.bool,
  field: PropTypes.shape({
    clone: PropTypes.bool,
    isContainer: PropTypes.bool,
    preview: PropTypes.bool,
    validate: PropTypes.any
  }).isRequired,
  selectedComponent: PropTypes.string,
  draggingContainer: PropTypes.string
};

const MemoizedField = (props) => {
  const { selectedComponent, draggingContainer } = useSelector(
    ({ selectedComponent, draggingContainer }) => ({
      selectedComponent,
      draggingContainer
    }),
    shallowEqual
  );
  return (
    <Field
      {...props}
      selectedComponent={selectedComponent}
      draggingContainer={draggingContainer}
    />
  );
};

export default MemoizedField;
