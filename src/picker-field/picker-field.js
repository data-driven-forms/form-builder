import React, { useContext, Fragment, memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import ComponentsContext from './components-context';
import { builderComponentTypes } from './constants';

const PickerField = memo(
  ({ field, index }) => {
    const { pickerMapper, builderMapper, componentMapper } = useContext(ComponentsContext);
    const Component = pickerMapper[field.component] || pickerMapper[builderComponentTypes.PICKER_FIELD];
    const Clone = builderMapper[field.component] || builderMapper[builderComponentTypes.BUILDER_FIELD];
    return (
      <Draggable draggableId={field.id} index={index}>
        {(provided, snapshot) => (
          <Fragment>
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              {snapshot.isDragging && field.clone ? (
                <Clone
                  input={{ name: 'template-clone' }}
                  meta={{}}
                  name="template-clone"
                  innerProps={{ snapshot, isClone: true }}
                  component={field.component}
                  Component={componentMapper[field.component]}
                />
              ) : (
                <Component innerProps={{ snapshot, isClone: true }} component={field.component} />
              )}
            </div>
            {snapshot.isDragging && <Component {...snapshot} component={field.component} />}
          </Fragment>
        )}
      </Draggable>
    );
  },
  (prevProps, nextProps) => prevProps.index === nextProps.index
);

PickerField.propTypes = {
  index: PropTypes.number.isRequired,
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    component: PropTypes.string.isRequired,
    clone: PropTypes.bool,
  }).isRequired,
};

export default PickerField;
