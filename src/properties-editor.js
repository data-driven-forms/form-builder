import React, { useContext, Fragment } from 'react';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import PropTypes from 'prop-types';
import StoreContext from './store-context';
import ComponentsContext from './components-context';
import validatorsProperties from './validators-properties';

const restrictionHandler = {
  min: (value, defaultValue) =>
    !value ? defaultValue : value < defaultValue ? defaultValue : value,
  max: (value, defaultValue) =>
    !value ? defaultValue : value > defaultValue ? defaultValue : value
};

const validatorChangeValue = (property, value) => {
  let result = property.type === 'number' ? Number(result) : result;
  if (property.restriction) {
    result = restrictionHandler[property.restriction.inputAttribute](
      value,
      property.original[property.restriction.validatorAttribute]
    );
  }
  return {
    [property.propertyName]: result
  };
};

const validatorOptions = Object.keys(validatorTypes)
  .filter((key) => validatorTypes[key] !== validatorTypes.REQUIRED)
  .map((key) => ({ value: validatorTypes[key], label: validatorTypes[key] }));

const ValidatorProperty = ({ property, onChange, value, index }) => {
  const { propertiesMapper } = useContext(ComponentsContext);
  const Component = propertiesMapper[property.component];
  const restrictionProperty =
    property.restriction && property.original
      ? {
          [property.restriction.inputAttribute]:
            property.original[property.restriction.validatorAttribute]
        }
      : {};
  return (
    <Component
      value={value}
      type={property.type}
      onChange={(value) =>
        onChange(validatorChangeValue(property, value), 'modify', index)
      }
      label={property.label}
      {...restrictionProperty}
    />
  );
};

ValidatorProperty.propTypes = {
  property: PropTypes.shape({
    original: PropTypes.object,
    propertyName: PropTypes.string.isRequired,
    component: PropTypes.string.isRequired,
    type: PropTypes.string,
    label: PropTypes.string.isRequired,
    restriction: PropTypes.shape({
      inputAttribute: PropTypes.string.isRequired,
      validatorAttribute: PropTypes.string.isRequired
    })
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

  const handleValidatorChange = (value = {}, action, index) =>
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
              isDisabled={fields[selectedComponent].restricted}
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
            {validate.map(({ type, original, ...rest }, index) =>
              type !== validatorTypes.REQUIRED ? (
                <Fragment key={`${type}-${index}`}>
                  {validatorsProperties[type].map((property, propertyIndex) => (
                    <ValidatorProperty
                      key={propertyIndex}
                      onChange={handleValidatorChange}
                      property={{
                        ...property,
                        original
                      }}
                      value={rest[property.propertyName]}
                      index={index}
                    />
                  ))}
                  {!original && (
                    <button
                      type="button"
                      onClick={() => handleValidatorChange({}, 'remove', index)}
                    >
                      Delete
                    </button>
                  )}
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
