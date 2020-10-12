import React from 'react';
import PropTypes from 'prop-types';
import FormBuilderLayout from './form-builder-layout';
import ComponentsContext from './components-context';
import createInitialData from './helpers/create-initial-data';
import { Provider } from 'react-redux';
import builderStore from './builder-state/builder-store';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';

const ContainerEnd = ({ id }) => <div>{id}</div>;

ContainerEnd.propTypes = {
  id: PropTypes.string,
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
  openEditor,
  ...props
}) => {
  const initialFields = Object.keys(componentProperties).reduce(
    (acc, curr) => ({
      ...acc,
      [`initial-${curr}`]: {
        preview: true,
        id: `initial-${curr}`,
        component: curr,
        clone: cloneWhileDragging,
        isContainer: componentProperties[curr].isContainer,
      },
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
        componentMapper,
        openEditor,
      }}
    >
      <Form onSubmit={() => {}}>
        {() => (
          <RendererContext.Provider value={{ formOptions: {} }}>
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
        propertyName: PropTypes.string.isRequired,
      })
    ),
  }),
  pickerMapper: PropTypes.object,
  propertiesMapper: PropTypes.object,
  cloneWhileDragging: PropTypes.bool,
  schema: PropTypes.object,
  schemaTemplate: PropTypes.object,
  componentMapper: PropTypes.object,
  openEditor: PropTypes.bool,
  children: PropTypes.node,
};

FormBuilder.defaultProps = {
  mode: 'default',
  debug: false,
};

export default FormBuilder;
