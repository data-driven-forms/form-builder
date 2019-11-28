import React from 'react';
import FormBuilder from './form-builder';
import ComponentsContext from './components-context';

const App = ({
  componentMapper,
  componentProperties,
  pickerMapper,
  propertiesMapper,
}) => (
  <ComponentsContext.Provider
    value={{
      componentMapper,
      componentProperties,
      pickerMapper,
      propertiesMapper,
    }}
  >
    <FormBuilder />
  </ComponentsContext.Provider>
);

export default App;
