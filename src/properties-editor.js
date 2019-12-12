import React, { useContext, Fragment } from 'react';
import StoreContext from './store-context';
import ComponentsContext from './components-context';

const PropertyDefault = ({ propertyName, value, label, onChange }) => (
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
  const {
    componentMapper: { BuilderColumn, PropertiesEditor },
    componentProperties,
    propertiesMapper
  } = useContext(ComponentsContext);
  const field = fields[selectedComponent];
  const properties = componentProperties[field.component].attributes;
  const NameComponent = propertiesMapper.input;

  const handlePropertyChange = (value, propertyName) =>
    dispatch({
      type: 'setFieldProperty',
      payload: {
        value,
        propertyName,
        fieldId: field.id
      }
    });
  return (
    <BuilderColumn className="container">
      <PropertiesEditor
        fieldName={fields[selectedComponent].name}
        propertiesChildren={
          <Fragment>
            <NameComponent
              label="Name"
              type="text"
              value={field.name}
              autoFocus={!field.initialized}
              onChange={(value) => handlePropertyChange(value, 'name')}
            />
            {properties.map((property) => {
              const Component =
                propertiesMapper[property.component] || PropertyDefault;
              return (
                <Component
                  key={property.propertyName}
                  {...property}
                  value={field[property.propertyName]}
                  onChange={(value) =>
                    handlePropertyChange(value, property.propertyName)
                  }
                />
              );
            })}
            <pre>{JSON.stringify(field, null, 2)}</pre>
          </Fragment>
        }
      />
    </BuilderColumn>
  );
};

export default PropertiesEditor;
