import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import FormBuilderLayout from './form-builder-layout';
import ComponentsContext from './components-context';
import createInitialData from './helpers/create-initial-data';
import { Provider } from 'react-redux';
import builderStore from './builder-state/builder-store';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import { Droppable } from 'react-beautiful-dnd';
import Field from './field';
import { FieldContext, DropTargetContext } from './layout-context';

const ContainerEnd = ({ id }) => <div>{id}</div>;

ContainerEnd.propTypes = {
  id: PropTypes.string
};

const DroppableSubform = ({ fields = [] }) => {
  const {
    builderMapper: { FormContainer, EmptyTarget }
  } = useContext(ComponentsContext);
  const { disableDrag } = useContext(DropTargetContext);

  const { isDragging, id = 'new' } = useContext(FieldContext);

  if (isDragging) {
    return (
      <Droppable droppableId={id} type="disabled" isDropDisabled={true}>
        {(provided, snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ background: '#f0f0f0', padding: 16, display: 'hidden', pointerEvents: 'none' }}
            >
              disabled
            </div>
          );
        }}
      </Droppable>
    );
  }

  console.log(fields, id);

  return (
    <Droppable droppableId={id} isDropDisabled={isDragging} onDrop={(...ags) => console.log('args', args)}>
      {(provided, snapshot) => {
        console.log(provided.innerRef, provided.droppableProps);
        return (
          <FormContainer isDraggingOver={snapshot.isDraggingOver} style={{ width: 'initial', gridColumn: '1/13' }}>
            <div ref={provided.innerRef} {...provided.droppableProps} style={{ background: '#f0f0f0', padding: 16 }}>
              {fields.length === 0 && <EmptyTarget />}
              {fields.map((id, index) => (
                <Field disableDrag={disableDrag} key={id} fieldId={id} index={index} />
              ))}
              {provided.placeholder}
            </div>
          </FormContainer>
        );
      }}
    </Droppable>
  );
};

const FormBuilder = ({
  builderMapper,
  componentProperties,
  pickerMapper,
  propertiesMapper,
  cloneWhileDragging,
  schema,
  schemaTemplate,
  mode,
  debug,
  children,
  componentMapper,
  ...props
}) => {
  const initialFields = Object.keys(componentProperties).reduce(
    (acc, curr) => ({
      ...acc,
      [`initial-${curr}`]: {
        preview: true,
        id: `initial-${curr}`,
        component: curr,
        clone: cloneWhileDragging
      }
    }),
    {}
  );
  return (
    <ComponentsContext.Provider
      value={{
        builderMapper: { ...builderMapper, 'container-end': ContainerEnd },
        componentProperties,
        pickerMapper,
        propertiesMapper,
        debug,
        componentMapper
      }}
    >
      <Form onSubmit={() => {}}>
        {() => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm: (fields) => <DroppableSubform fields={fields} />
              }
            }}
          >
            <Provider store={builderStore}>
              <FormBuilderLayout initialFields={createInitialData(initialFields, schema, mode === 'subset', schemaTemplate)} mode={mode} {...props}>
                {children}
              </FormBuilderLayout>
            </Provider>
          </RendererContext.Provider>
        )}
      </Form>
    </ComponentsContext.Provider>
  );
};

FormBuilder.propTypes = {
  mode: PropTypes.oneOf(['default', 'subset']),
  debug: PropTypes.bool,
  builderMapper: PropTypes.object,
  componentProperties: PropTypes.shape({
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        component: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        propertyName: PropTypes.string.isRequired
      })
    )
  }),
  pickerMapper: PropTypes.object,
  propertiesMapper: PropTypes.object,
  cloneWhileDragging: PropTypes.bool,
  schema: PropTypes.object,
  schemaTemplate: PropTypes.object,
  componentMapper: PropTypes.object
};

FormBuilder.defaultProps = {
  mode: 'default',
  debug: false
};

export default FormBuilder;
