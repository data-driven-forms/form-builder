import React, { useContext, useState, useEffect, Fragment } from 'react';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import ComponentsContext from '../components-context';
import validatorsProperties from '../validators-properties';
import MemoizedProperty from './memoized-property';
import MemoizedValidator from './memozied-validator';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { SET_FIELD_VALIDATOR, SET_FIELD_PROPERTY, SET_SELECTED_COMPONENT, REMOVE_COMPONENT } from '../builder-state/builder-reducer';

const validatorOptions = Object.keys(validatorTypes)
  .filter((key) => validatorTypes[key] !== validatorTypes.REQUIRED)
  .map((key) => ({ value: validatorTypes[key], label: validatorTypes[key] }));

const checkRequiredDisabled = (field) => {
  return !!(field.restricted && !!field.validate && !!field.validate.find(({ type, original }) => original && type === validatorTypes.REQUIRED));
};

const PropertiesEditor = () => {
  const dispatch = useDispatch();
  const field = useSelector(({ selectedComponent, fields }) => fields[selectedComponent], shallowEqual);
  const {
    componentMapper: { PropertiesEditor, PropertyGroup },
    componentProperties,
    propertiesMapper,
    debug,
    classnamePrefix
  } = useContext(ComponentsContext);
  const [requiredDisabled, setRequiredDisabled] = useState(true);
  useEffect(() => {
    setRequiredDisabled(() => checkRequiredDisabled(field));
  }, [field]);
  const properties = componentProperties[field.component].attributes;
  const validate = field.validate || [];
  const NameComponent = propertiesMapper.input;
  const InitialValueComponent = propertiesMapper.input;
  const MessageComponent = propertiesMapper.input;
  const IsRequiredComponent = propertiesMapper.switch;

  const handlePropertyChange = (value, propertyName) =>
    dispatch({
      type: SET_FIELD_PROPERTY,
      payload: {
        value,
        propertyName,
        fieldId: field.id
      }
    });

  const handleValidatorChange = (value = {}, action, index) =>
    dispatch({
      type: SET_FIELD_VALIDATOR,
      payload: {
        ...value,
        fieldId: field.id,
        index,
        action
      }
    });

  const requiredIndex = validate.reduce((acc, curr, index) => (curr.type === validatorTypes.REQUIRED ? index : acc), 0);

  const hasPropertyError = field.propertyValidation && Object.entries(field.propertyValidation).find(([, value]) => value);

  return (
    <Fragment>
      <PropertiesEditor
        fieldName={field.name}
        hasPropertyError={hasPropertyError}
        avaiableValidators={validatorOptions}
        addValidator={(type) => handleValidatorChange({ type }, 'add')}
        handleClose={() => dispatch({ type: SET_SELECTED_COMPONENT })}
        handleDelete={
          !field.restricted
            ? () =>
                dispatch({
                  type: REMOVE_COMPONENT,
                  payload: field.id
                })
            : undefined
        }
        propertiesChildren={
          <Fragment>
            <MemoizedProperty
              Component={NameComponent}
              property={{ propertyName: 'name' }}
              autoFocus={!field.initialized}
              isDisabled={field.restricted}
              handlePropertyChange={handlePropertyChange}
              label="Name"
            />
            <MemoizedProperty
              label="Initial value"
              type="text"
              Component={InitialValueComponent}
              handlePropertyChange={handlePropertyChange}
              property={{ propertyName: 'initialValue' }}
            />
            {properties.map((property) => {
              const Component = propertiesMapper[property.component];
              return (
                <MemoizedProperty key={property.propertyName} Component={Component} property={property} handlePropertyChange={handlePropertyChange} />
              );
            })}
          </Fragment>
        }
        validationChildren={
          <Fragment>
            <PropertyGroup title="required validator" className={`${classnamePrefix}__validators-validator-group`}>
              <IsRequiredComponent
                value={field.isRequired}
                label="Required"
                fieldId="required-validator"
                isDisabled={requiredDisabled}
                innerProps={{}}
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
                  innerProps={{}}
                  value={validate.find(({ type }) => type === validatorTypes.REQUIRED).message || ''}
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
                  handleDelete={!original ? () => handleValidatorChange({}, 'remove', index) : undefined}
                  key={`${type}-${index}`}
                  className={`${classnamePrefix}__validators-validator-group`}
                >
                  {validatorsProperties[type].map((property, propertyIndex) => (
                    <MemoizedValidator
                      key={propertyIndex}
                      handleValidatorChange={handleValidatorChange}
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
