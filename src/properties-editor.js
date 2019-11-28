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
      onChange={({ target: { checked } }) => onChange(checked)}
    />
  </div>
);

const PropertiesEditor = () => {
  const { state, dispatch } = useContext(StoreContext);
  const { selectedComponent, fields } = state;
  const { componentMapper: { BuilderColumn }, componentProperties, propertiesMapper } = useContext(ComponentsContext);
  const field = fields[selectedComponent];
  const properties = componentProperties[field.component];
  const NameComponent = propertiesMapper.input;

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
      <h2>{fields[selectedComponent].name}</h2>
      <div>
        <NameComponent
          label="Name"
          type="text"
          value={field.name}
          onChange={value => handlePropertyChange(value, 'name')}
        />
      </div>
      <div>
        {properties.map(property => {
          const Component = propertiesMapper[property.component] || PropertyDefault;
          return (
            <Component
              key={property.propertyName}
              {...property}
              value={field[property.propertyName] || ''}
              onChange={value => handlePropertyChange(value, property.propertyName)}
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
