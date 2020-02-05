import React from 'react';
import PropTypes from 'prop-types';
import FormBuilder from './form-builder';
import ComponentsContext from './components-context';
import createInitialData from './helpers/create-initial-data';

const ContainerEnd = ({ id }) => <div>{id}</div>;

const App = ({
  componentMapper,
  componentProperties,
  pickerMapper,
  propertiesMapper,
  cloneWhileDragging,
  schema,
  schemaTemplate,
  mode,
  debug,
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
        isContainer: componentProperties[curr].isContainer
      }
    }),
    {}
  );
  return (
    <ComponentsContext.Provider
      value={{
        componentMapper: { ...componentMapper, 'container-end': ContainerEnd },
        componentProperties,
        pickerMapper,
        propertiesMapper,
        debug
      }}
    >
      <FormBuilder
        initialFields={createInitialData(
          initialFields,
          schema,
          mode === 'subset',
          schemaTemplate
        )}
        mode={mode}
        {...props}
      />
    </ComponentsContext.Provider>
  );
};

App.propTypes = {
  mode: PropTypes.oneOf(['default', 'subset']),
  debug: PropTypes.bool,
  componentMapper: PropTypes.shape({
    [PropTypes.string.isRequired]: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
      PropTypes.func
    ]).isRequired
  }),
  componentProperties: PropTypes.shape({
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        component: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        propertyName: PropTypes.string.isRequired
      })
    )
  }),
  pickerMapper: PropTypes.shape({
    [PropTypes.string.isRequired]: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
      PropTypes.func
    ]).isRequired
  }),
  propertiesMapper: PropTypes.shape({
    [PropTypes.string.isRequired]: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
      PropTypes.func
    ]).isRequired
  }),
  cloneWhileDragging: PropTypes.bool,
  schema: PropTypes.object,
  schemaTemplate: PropTypes.object
};

App.defaultProps = {
  mode: 'default',
  debug: false
};

export default App;
