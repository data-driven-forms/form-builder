import React, { useContext, useState, useEffect, Fragment } from 'react';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import StoreContext from '../store-context';
import ComponentsContext from '../components-context';
import validatorsProperties from '../validators-properties';
import MemoizedProperty from './memoized-property';
import MemoizedValidator from './memozied-validator';

const validatorOptions = Object.keys(validatorTypes)
  .filter((key) => validatorTypes[key] !== validatorTypes.REQUIRED)
  .map((key) => ({ value: validatorTypes[key], label: validatorTypes[key] }));

const checkRequiredDisabled = (field) => {
  return !!(
    field.restricted &&
    !!field.validate &&
    !!field.validate.find(
      ({ type, original }) => original && type === validatorTypes.REQUIRED
    )
  );
};

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
              const Component = propertiesMapper[property.component];
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
