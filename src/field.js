import React, { useContext, memo, Fragment } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import ComponentsContext from './components-context';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { builderComponentTypes } from './constants';

const Field = memo(({ fieldId, index, shouldClone, disableDrag, draggingContainer }) => {
  const {
    builderMapper: { FieldActions, FieldLayout, DragHandle, ...rest },
    componentMapper
  } = useContext(ComponentsContext);
  const { clone, validate, ...field } = useSelector(({ fields }) => fields[fieldId]);
  const selectedComponent = useSelector(({ selectedComponent }) => selectedComponent);
  const dispatch = useDispatch();
  const FieldComponent = rest[field.component] || rest[builderComponentTypes.BUILDER_FIELD];

  const hasPropertyError = field.propertyValidation && Object.entries(field.propertyValidation).find(([, value]) => value);

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
            style={
              field.container !== undefined && field.container === draggingContainer
                ? {
                    visibility: 'hidden',
                    height: 0,
                    padding: 0,
                    border: 0,
                    margin: 0
                  }
                : {}
            }
            ref={provided.innerRef}
            {...provided.draggableProps}
            onClick={() => dispatch({ type: 'setSelectedComponent', payload: field.id })}
          >
            <FieldLayout disableDrag={disableDrag} dragging={snapshot.isDragging} selected={selectedComponent === field.id}>
              {field.preview ? (
                <div>{field.content}</div>
              ) : (
                <Fragment>
                  <FieldComponent {...cleanField} innerProps={innerProps} Component={componentMapper[field.component]} />
                  {!shouldClone && (
                    <DragHandle disableDrag={disableDrag} hasPropertyError={!!hasPropertyError} dragHandleProps={{ ...provided.dragHandleProps }} />
                  )}
                </Fragment>
              )}
            </FieldLayout>
          </div>
        );
      }}
    </Draggable>
  );
});

Field.propTypes = {
  index: PropTypes.number.isRequired,
  shouldClone: PropTypes.bool,
  disableDrag: PropTypes.bool,
  selectedComponent: PropTypes.string,
  draggingContainer: PropTypes.string,
  fieldId: PropTypes.string.isRequired
};

const MemoizedField = (props) => {
  const { selectedComponent, draggingContainer } = useSelector(
    ({ selectedComponent, draggingContainer }) => ({
      selectedComponent,
      draggingContainer
    }),
    isEqual
  );
  return <Field {...props} selectedComponent={selectedComponent} draggingContainer={draggingContainer} />;
};

export default MemoizedField;
