import React from 'react';
import FormBuilder from './form-builder';
import ComponentsContext from './components-context';

export const COMPONENTS_LIST = 'components-list';
export const FORM_LAYOUT = 'form-layout';

const createInitialData = (initialFields, schema) => {
  const fields = {
    ...initialFields
  };
  const fieldsIds = [];
  if (schema && schema.fields) {
    schema.fields.forEach((field) => {
      const id = `${field.name}-${Date.now().toString()}`;
      fieldsIds.push(id);
      fields[id] = {
        ...field,
        id,
        clone: true,
        preview: false,
        initialized: true
      };
    });
  }

  return {
    fields,
    dropTargets: {
      [COMPONENTS_LIST]: {
        id: COMPONENTS_LIST,
        title: 'Component chooser',
        fieldsIds: Object.keys(initialFields)
      },
      [FORM_LAYOUT]: {
        id: FORM_LAYOUT,
        title: 'Form',
        fieldsIds
      }
    },
    selectedComponent: undefined,
    containers: []
  };
};

const ContainerEnd = ({ id }) => <div>{id}</div>;

const App = ({
  componentMapper,
  componentProperties,
  pickerMapper,
  propertiesMapper,
  cloneWhileDragging,
  schema,
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
      <FormBuilder
        initialFields={createInitialData(initialFields, schema)}
        {...props}
      />
    </ComponentsContext.Provider>
  );
};

export default App;
