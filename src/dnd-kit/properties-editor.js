import React, { useContext } from 'react';
import BuilderContext from '../dnd-kit/builder-context';

const PropertiesEditor = () => {
  const { selectedComponent, fields } = useContext(BuilderContext);
  const data = fields[selectedComponent];
  return (
    <div>
      <h1>Properties editor</h1>
      {data && <code>{JSON.stringify(data, null, 2)}</code>}
    </div>
  );
};

export default PropertiesEditor;
