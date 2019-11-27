import React from 'react';
import FormBuilder from './form-builder';
import ComponentsContext from './components-context';

const App = ({ componentMapper }) => {
  console.log(componentMapper);
  return (
    <ComponentsContext.Provider value={componentMapper}>
      <FormBuilder />
    </ComponentsContext.Provider>
  );
};

export default App;
