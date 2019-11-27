import React, { useContext } from 'react';
import StoreContext from './store-context';
import ComponentsContext from './components-context';

const PropertiesEditor = () => {
  const { state, dispatch } = useContext(StoreContext);
  const { selectedComponent, fields } = state;
  const { BuilderColumn } = useContext(ComponentsContext);
  return (
    <BuilderColumn className="container">
      <h1>
        There will be properties editor
      </h1>
      <h2>{fields[selectedComponent].id}</h2>
    </BuilderColumn>
  );
};

export default PropertiesEditor;
