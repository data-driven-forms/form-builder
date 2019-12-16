import React, { useContext, Fragment } from 'react';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import PropTypes from 'prop-types';
import StoreContext from './store-context';
import ComponentsContext from './components-context';
import validatorsProperties from './validators-properties';

const validatorOptions = Object.keys(validatorTypes)
  .filter((key) => validatorTypes[key] !== validatorTypes.REQUIRED)
  .map((key) => ({ value: validatorTypes[key], label: validatorTypes[key] }));

const ValidatorProperty = ({ property, onChange, value, index }) => {
  const { propertiesMapper } = useContext(ComponentsContext);
  const Component = propertiesMapper[property.component];
  return (
    <Component
      value={value}
      type={property.type}
      onChange={(value) =>
        onChange(
          {
            [property.propertyName]:
              property.type === 'number' ? Number(value) : value
          },
          'modify',
          index
        )
      }
      label={property.label}
    />
  );
};

ValidatorProperty.propTypes = {
  property: PropTypes.shape({
    propertyName: PropTypes.string.isRequired,
    component: PropTypes.string.isRequired,
    type: PropTypes.string,
    label: PropTypes.string.isRequired
  }),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  index: PropTypes.number.isRequired
};

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
  const validate = field.validate || [];
  const NameComponent = propertiesMapper.input;
  const MessageComponent = propertiesMapper.input;
  const IsRequiredComponent = propertiesMapper.switch;

  const handlePropertyChange = (value, propertyName) =>
    dispatch({
      type: 'setFieldProperty',
      payload: {
        value,
        propertyName,
        fieldId: field.id
      }
    });

  const handleValidatorChange = (value, action, index) =>
    dispatch({
      type: 'setFieldValidator',
      payload: {
        ...value,
        fieldId: field.id,
        index,
        action
      }
    });

  return (
    <BuilderColumn className="container">
      <PropertiesEditor
        fieldName={fields[selectedComponent].name}
        avaiableValidators={validatorOptions}
        addValidator={(type) => handleValidatorChange({ type }, 'add')}
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
          </Fragment>
        }
        validationChildren={
          <Fragment>
            <IsRequiredComponent
              value={field.isRequired}
              label="Required"
              fieldId="required-validator"
              onChange={(value) =>
                handleValidatorChange(
                  {
                    type: validatorTypes.REQUIRED
                  },
                  value ? 'add' : 'remove',
                  0
                )
              }
            />
            {field.isRequired && (
              <MessageComponent
                label="Message"
                fieldId="required-message"
                value={validate[0].message || ''}
                onChange={(value) =>
                  handleValidatorChange(
                    {
                      message: value
                    },
                    'modify',
                    0
                  )
                }
              />
            )}
            {validate.map(({ type, ...rest }, index) =>
              type !== validatorTypes.REQUIRED ? (
                <Fragment key={`${type}-${index}`}>
                  <h1>{type}</h1>
                  {validatorsProperties[type].map((property, propertyIndex) => (
                    <ValidatorProperty
                      onChange={handleValidatorChange}
                      key={propertyIndex}
                      property={property}
                      value={rest[property.propertyName]}
                      index={index}
                    />
                  ))}
                </Fragment>
              ) : null
            )}
          </Fragment>
        }
      />
      <pre>{JSON.stringify(field, null, 2)}</pre>
    </BuilderColumn>
  );
};

export default PropertiesEditor;
