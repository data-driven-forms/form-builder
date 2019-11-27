import React, { useContext } from 'react';
import StoreContext from './store-context';
import ComponentsContext from './components-context';

const PropertyDefault = ({
  propertyName,
  value,
  label,
  onChange,
}) => (
  <div>
    <label htmlFor={propertyName}>{label}</label>
    <input
      type="checkbox"
      id={propertyName}
      name={propertyName}
      checked={value}
      onChange={({ target: { checked } }) => onChange(checked, propertyName)}
    />
  </div>
);

const PropertyInput = ({
  propertyName,
  value,
  label,
  onChange,
}) => (
  <div>
    <label htmlFor={propertyName}>{label}</label>
    <input
      type="text"
      id={propertyName}
      name={propertyName}
      value={value || ''}
      onChange={({ target: { value } }) => onChange(value, propertyName)}
    />
  </div>
);

const propertyMapper = {
  input: PropertyInput,
};

const PropertiesEditor = () => {
  const { state, dispatch } = useContext(StoreContext);
  const { selectedComponent, fields } = state;
  const { componentMapper: { BuilderColumn }, componentProperties } = useContext(ComponentsContext);
  const field = fields[selectedComponent];
  const properties = componentProperties[field.component];

  const handlePropertyChange = (value, propertyName) => dispatch({
    type: 'setFieldProperty',
    payload: {
      value,
      propertyName,
      fieldId: field.id,
    },
  });
  return (
    <BuilderColumn className="container">
      <h1>
        There will be properties editor
      </h1>
      <h2>{fields[selectedComponent].id}</h2>
      <div>
        <label>Name</label>
        <input type="text" value={field.name} onChange={({ target: { value } }) => handlePropertyChange(value, 'name')} />
      </div>
      <div>
        {properties.map(property => {
          const Component = propertyMapper[property.component] || PropertyDefault;
          return (
            <Component
              key={property.propertyName}
              {...property}
              value={field[property.propertyName]}
              onChange={handlePropertyChange}
            />
          );
        })}
      </div>
      <pre>
        {JSON.stringify(field, null, 2)}
      </pre>
    </BuilderColumn>
  );
};

export default PropertiesEditor;
