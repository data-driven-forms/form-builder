import React, { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Form } from 'react-final-form';
import PropTypes from 'prop-types';
import Field from './field';
import ComponentsContext from './components-context';
import { useSelector } from 'react-redux';
import { FORM_LAYOUT } from './helpers/create-initial-data';
import { DropTargetContext } from './layout-context';

const DropTarget = () => {
  const {
    componentMapper: { FormContainer }
  } = useContext(ComponentsContext);
  const { disableDrag } = useContext(DropTargetContext);
  const dropTargets = useSelector(({ dropTargets }) => dropTargets);
  const dropTargetId = useSelector(({ dropTargets }) => dropTargets[FORM_LAYOUT].id);
  const fields = dropTargets[FORM_LAYOUT].fieldsIds;
  return (
    <Droppable droppableId={dropTargetId}>
      {(provided, snapshot) => {
        return (
          <Form onSubmit={() => {}}>
            {() => (
              <FormContainer isDraggingOver={snapshot.isDraggingOver}>
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {fields.map((fieldId, index) => (
                    <Field disableDrag={disableDrag} key={fieldId} fieldId={fieldId} index={index} />
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
  isDropDisabled: PropTypes.bool,
  shouldClone: PropTypes.bool,
  disableDrag: PropTypes.bool,
  disableDelete: PropTypes.bool
};

export default DropTarget;
