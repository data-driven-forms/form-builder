import React from 'react';
import FormBuilder from './form-builder';
import ComponentsContext from './components-context';

const App = ({ componentMapper, componentProperties }) => (
  <ComponentsContext.Provider value={{ componentMapper, componentProperties }}>
    <FormBuilder />
  </ComponentsContext.Provider>
);

export default App;
