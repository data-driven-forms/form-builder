import React, { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import { Form } from 'react-final-form';
import PropTypes from 'prop-types';
import Field from './field';
import ComponentsContext from './components-context';

const DropTarget = ({
  dropTarget,
  fields,
  isDropDisabled,
  shouldClone,
  disableDrag,
  disableDelete
}) => {
  const {
    componentMapper: { FormContainer },
    classNamePrefix
  } = useContext(ComponentsContext);
  return (
    <Droppable droppableId={dropTarget.id} isDropDisabled={isDropDisabled}>
      {(provided, snapshot) => {
        return (
          <Form onSubmit={() => {}}>
            {() => (
              <FormContainer className={`${classNamePrefix}__form-preview`}>
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={clsx(`${classNamePrefix}__drop-list`, {
                    dragging: snapshot.isDraggingOver
                  })}
                >
                  {fields.map((field, index) => (
                    <Field
                      disableDrag={disableDrag}
                      disableDelete={disableDelete && field.restricted}
                      shouldClone={shouldClone}
                      key={field.id}
                      field={field}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              </FormContainer>
            )}
          </Form>
        );
      }}
    </Droppable>
  );
};

DropTarget.propTypes = {
  dropTarget: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ).isRequired,
  isDropDisabled: PropTypes.bool,
  shouldClone: PropTypes.bool,
  disableDrag: PropTypes.bool,
  disableDelete: PropTypes.bool
};

export default DropTarget;
