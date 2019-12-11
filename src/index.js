import React from 'react';
import FormBuilder from './form-builder';
import ComponentsContext from './components-context';

export const COMPONENTS_LIST = 'components-list';
export const FORM_LAYOUT = 'form-layout';

const createInitialData = (initialFields) => ({
  fields: {
    ...initialFields
  },
  dropTargets: {
    [COMPONENTS_LIST]: {
      id: COMPONENTS_LIST,
      title: 'Component chooser',
      fieldsIds: Object.keys(initialFields)
    },
    [FORM_LAYOUT]: {
      id: FORM_LAYOUT,
      title: 'Form',
      fieldsIds: []
    }
  },
  selectedComponent: undefined,
  containers: []
});

const ContainerEnd = ({ id }) => <div>{id}</div>;

const App = ({
  componentMapper,
  componentProperties,
  pickerMapper,
  propertiesMapper,
  cloneWhileDragging,
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
        propertiesMapper
      }}
    >
      <FormBuilder initialFields={createInitialData(initialFields)} {...props} />
    </ComponentsContext.Provider>
  );
};

export default App;
