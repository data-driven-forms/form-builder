import React, { useContext } from 'react';
import StoreContext from './store-context';

const PropertiesEditor = () => {
  const { state, dispatch } = useContext(StoreContext);
  const { selectedComponent, fields } = state;
  return (
    <div>
      <h1>
        There will be properties editor
      </h1>
      <h2>{fields[selectedComponent].id}</h2>
    </div>
  );
};

export default PropertiesEditor;
