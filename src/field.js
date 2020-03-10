import React, { useContext, memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Field as FinalFormField, useField } from 'react-final-form';
import PropTypes from 'prop-types';
import ComponentsContext from './components-context';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';

const Field = memo(({ fieldId, index, shouldClone, disableDrag, draggingContainer }) => {
  const {
    componentMapper: { FieldActions, FieldLayout, DragHandle, ...rest }
  } = useContext(ComponentsContext);
  const { clone, isContainer, validate, ...field } = useSelector(({ fields }) => fields[fieldId]);
  const selectedComponent = useSelector(({ selectedComponent }) => selectedComponent);
  const dispatch = useDispatch();
  const FieldComponent = rest[field.component];
  const formOptions = {
    renderForm: () => null
  };

  const hasPropertyError = field.propertyValidation && Object.entries(field.propertyValidation).find(([, value]) => value);
  if (field.component === 'container-end') {
    return (
      <Draggable isDragDisabled draggableId={field.id} index={index}>
        {(provided) => (
          <div
            style={
              field.id.match(new RegExp(`^${draggingContainer}-end`))
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
          ></div>
        )}
      </Draggable>
    );
  }
  const { hideField, initialized, preview, restricted, ...cleanField } = field;
  const { input, meta } = useField(field.name, { initialValue: field.initialValue });
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
            <FieldLayout
              disableDrag={disableDrag}
              dragging={snapshot.isDragging}
              selected={selectedComponent === field.id}
              isContainer={isContainer}
              inContainer={field.container}
            >
              {field.preview ? (
                <div>{field.content}</div>
              ) : (
                <FieldComponent
                  input={input}
                  meta={meta}
                  {...cleanField}
                  FieldProvider={FinalFormField}
                  formOptions={formOptions}
                  innerProps={innerProps}
                />
              )}
            </FieldLayout>
            {!shouldClone && (
              <DragHandle disableDrag={disableDrag} hasPropertyError={!!hasPropertyError} dragHandleProps={{ ...provided.dragHandleProps }} />
            )}
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
