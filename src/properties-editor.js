import React, { useContext, useState, useEffect, Fragment, memo } from 'react';
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

const ValidatorProperty = ({ property, onChange, value, index, restricted }) => {
  const { propertiesMapper } = useContext(ComponentsContext);
  const Component = propertiesMapper[property.component];
  const restrictionProperty =
    property.restriction && property.original
      ? {
          isDisabled: property.restriction.lock,
          [property.restriction.inputAttribute]:
            property.original[property.restriction.validatorAttribute]
        }
      : {};

  return (
    <Component
      value={value}
      type={property.type}
      onBlur={() =>
        property.propertyName !== 'message' &&
        restricted &&
        onChange(validatorChangeValue(property, value), 'modify', index)
      }
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
    restricted: PropTypes.bool,
    restriction: PropTypes.shape({
      inputAttribute: PropTypes.string.isRequired,
      validatorAttribute: PropTypes.string.isRequired,
      lock: PropTypes.bool
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

const checkRequiredDisabled = (field) => {
  return !!(
    field.restricted &&
    !!field.validate &&
    !!field.validate.find(
      ({ type, original }) => original && type === validatorTypes.REQUIRED
    )
  );
};

const PropertyComponent = ({
  Component,
  property,
  field,
  handlePropertyChange,
  ...props
}) => (
  <Component
    propertyValidation={
      field.propertyValidation && field.propertyValidation[property.propertyName]
    }
    {...props}
    {...property}
    value={field[property.propertyName]}
    onChange={(value) => handlePropertyChange(value, property.propertyName)}
  />
);

PropertyComponent.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.element])
    .isRequired,
  property: PropTypes.shape({ propertyName: PropTypes.string.isRequired })
    .isRequired,
  field: PropTypes.shape({
    propertyValidation: PropTypes.object
  }).isRequired,
  handlePropertyChange: PropTypes.func.isRequired
};

const MemoizedProperty = memo(
  PropertyComponent,
  (prevProps, nextProps) =>
    prevProps.field[prevProps.property.propertyName] ===
    nextProps.field[nextProps.property.propertyName]
);

const ValidatorComponent = ({
  handleValidatorChange,
  property,
  original,
  field,
  validator,
  index
}) => (
  <ValidatorProperty
    onChange={handleValidatorChange}
    property={{
      ...property,
      original
    }}
    restricted={field.restricted}
    value={validator[property.propertyName]}
    index={index}
  />
);

ValidatorComponent.propTypes = {
  handleValidatorChange: PropTypes.func.isRequired,
  property: PropTypes.shape({
    propertyName: PropTypes.string.isRequired
  }).isRequired,
  original: PropTypes.object,
  field: PropTypes.shape({ restricted: PropTypes.bool }).isRequired,
  validator: PropTypes.object,
  index: PropTypes.number.isRequired
};

const MemoizedValidator = memo(ValidatorComponent, (prevProps, nextProps) => {
  return (
    prevProps.validator[prevProps.property.propertyName] ===
    nextProps.validator[nextProps.property.propertyName]
  );
});

const PropertiesEditor = () => {
  const { state, dispatch } = useContext(StoreContext);
  const { selectedComponent, fields } = state;
  const {
    componentMapper: { PropertiesEditor, PropertyGroup },
    componentProperties,
    propertiesMapper,
    debug
  } = useContext(ComponentsContext);
  const [requiredDisabled, setRequiredDisabled] = useState(false);
  const field = fields[selectedComponent];
  useEffect(() => {
    setRequiredDisabled(() => checkRequiredDisabled(fields[selectedComponent]));
  }, [selectedComponent]);
  const properties = componentProperties[field.component].attributes;
  const validate = field.validate || [];
  const NameComponent = propertiesMapper.input;
  const InitialValueComponent = propertiesMapper.input;
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

  const requiredIndex = validate.reduce(
    (acc, curr, index) => (curr.type === validatorTypes.REQUIRED ? index : acc),
    0
  );

  return (
    <Fragment>
      <PropertiesEditor
        fieldName={fields[selectedComponent].name}
        avaiableValidators={validatorOptions}
        addValidator={(type) => handleValidatorChange({ type }, 'add')}
        handleClose={() => dispatch({ type: 'setSelectedComponent' })}
        handleDelete={
          !fields[selectedComponent].restricted
            ? () =>
                dispatch({
                  type: 'removeComponent',
                  payload: fields[selectedComponent].id
                })
            : undefined
        }
        propertiesChildren={
          <Fragment>
            <MemoizedProperty
              Component={NameComponent}
              field={field}
              property={{ propertyName: 'name' }}
              autoFocus={!field.initialized}
              isDisabled={fields[selectedComponent].restricted}
              value={field.name}
              handlePropertyChange={handlePropertyChange}
              label="Name"
            />
            <MemoizedProperty
              label="Initial value"
              type="text"
              Component={InitialValueComponent}
              value={field.initialValue}
              handlePropertyChange={handlePropertyChange}
              field={field}
              property={{ propertyName: 'initialValue' }}
            />
            {properties.map((property) => {
              const Component =
                propertiesMapper[property.component] || PropertyDefault;
              return (
                <MemoizedProperty
                  key={property.propertyName}
                  Component={Component}
                  field={field}
                  property={property}
                  handlePropertyChange={handlePropertyChange}
                />
              );
            })}
          </Fragment>
        }
        validationChildren={
          <Fragment>
            <PropertyGroup
              title="required validator"
              className="ddorg__form__builder-validators-validator-group"
            >
              <IsRequiredComponent
                value={field.isRequired}
                label="Required"
                fieldId="required-validator"
                isDisabled={requiredDisabled}
                onChange={(value) =>
                  handleValidatorChange(
                    {
                      type: validatorTypes.REQUIRED
                    },
                    value ? 'add' : 'remove',
                    requiredIndex
                  )
                }
              />
              {field.isRequired && (
                <MessageComponent
                  label="Message"
                  fieldId="required-message"
                  value={
                    validate.find(({ type }) => type === validatorTypes.REQUIRED)
                      .message || ''
                  }
                  onChange={(value) =>
                    handleValidatorChange(
                      {
                        message: value
                      },
                      'modify',
                      requiredIndex
                    )
                  }
                />
              )}
            </PropertyGroup>
            {validate.map(({ type, original, ...rest }, index) =>
              type !== validatorTypes.REQUIRED ? (
                <PropertyGroup
                  title={type.split('-').join(' ')}
                  handleDelete={
                    !original
                      ? () => handleValidatorChange({}, 'remove', index)
                      : undefined
                  }
                  key={`${type}-${index}`}
                  className="ddorg__form__builder-validators-validator-group"
                >
                  {validatorsProperties[type].map((property, propertyIndex) => (
                    <MemoizedValidator
                      key={propertyIndex}
                      handleValidatorChange={handleValidatorChange}
                      field={field}
                      validator={rest}
                      property={property}
                      original={original}
                      index={index}
                    />
                  ))}
                </PropertyGroup>
              ) : null
            )}
          </Fragment>
        }
      />
      {debug && <pre>{JSON.stringify(field, null, 2)}</pre>}
    </Fragment>
  );
};

export default PropertiesEditor;
