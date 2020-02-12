import React from 'react';
import PropTypes from 'prop-types';
import FormBuilder from './form-builder';
import ComponentsContext from './components-context';
import createInitialData from './helpers/create-initial-data';
import { Provider } from 'react-redux';
import builderStore from './builder-state/builder-store';

const ContainerEnd = ({ id }) => <div>{id}</div>;

ContainerEnd.propTypes = {
  id: PropTypes.string
};

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
  classNamePrefix,
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
        debug,
        classNamePrefix
      }}
    >
      <Provider store={builderStore}>
        <FormBuilder
          initialFields={createInitialData(initialFields, schema, mode === 'subset', schemaTemplate)}
          classNamePrefix={classNamePrefix}
          mode={mode}
          {...props}
        />
      </Provider>
    </ComponentsContext.Provider>
  );
};

App.propTypes = {
  mode: PropTypes.oneOf(['default', 'subset']),
  debug: PropTypes.bool,
  componentMapper: PropTypes.object,
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
  classNamePrefix: PropTypes.string
};

App.defaultProps = {
  mode: 'default',
  debug: false,
  classNamePrefix: 'ddorg__form-builder'
};

export default App;
