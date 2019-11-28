import React from 'react';
import FormBuilder from './form-builder';
import ComponentsContext from './components-context';

export const COMPONENTS_LIST = 'components-list';
export const FORM_LAYOUT = 'form-layout';

const createInitialData = (initialFields) => ({
  fields: {
    ...initialFields,
  },
  dropTargets: {
    [COMPONENTS_LIST]: {
      id: COMPONENTS_LIST,
      title: 'Component chooser',
      fieldsIds: Object.keys(initialFields),
    },
    [FORM_LAYOUT]: {
      id: FORM_LAYOUT,
      title: 'Form',
      fieldsIds: [],
    },
  },
  selectedComponent: undefined,
}
);

const App = ({
  componentMapper,
  componentProperties,
  pickerMapper,
  propertiesMapper,
}) => {
  const initialFields = Object.keys(componentProperties).reduce((acc, curr) => ({
    ...acc,
    [`initial-${curr}`]: { preview: true, id: `initial-${curr}`, component: curr },
  }), {});
  console.log('createInitialData', createInitialData(initialFields))
  return (
    <ComponentsContext.Provider
      value={{
        componentMapper,
        componentProperties,
        pickerMapper,
        propertiesMapper,
      }}
    >
      <FormBuilder initialFields={createInitialData(initialFields)} />
    </ComponentsContext.Provider>
  );
};

export default App;
