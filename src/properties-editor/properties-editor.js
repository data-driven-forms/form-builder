import React, { useContext, useState, useEffect, Fragment } from 'react';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import { useForm } from 'react-final-form';
import ComponentsContext from '../components-context';
import validatorsProperties from '../validators-properties';
import MemoizedProperty from './memoized-property';
import MemoizedValidator from './memozied-validator';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { SET_FIELD_VALIDATOR, SET_FIELD_PROPERTY, SET_SELECTED_COMPONENT, REMOVE_COMPONENT } from '../builder-store';
import convertInitialValue from './convert-initial-value';
import { FORM_LAYOUT } from '../helpers';

const validatorOptions = Object.keys(validatorTypes)
  .filter((key) => validatorTypes[key] !== validatorTypes.REQUIRED)
  .map((key) => ({ value: validatorTypes[key], label: validatorTypes[key] }));

const checkRequiredDisabled = (field) => {
  return !!(field.restricted && !!field.validate && !!field.validate.find(({ type, original }) => original && type === validatorTypes.REQUIRED));
};

const PropertiesEditor = () => {
  const form = useForm();
  const dispatch = useDispatch();
  const selectedComponent = useSelector(({ selectedComponent }) => selectedComponent, shallowEqual);
  const { field, dropTargets } = useSelector(
    ({ selectedComponent, fields, dropTargets }) => ({ field: fields[selectedComponent], dropTargets }),
    shallowEqual
  );
  const {
    builderMapper: { PropertiesEditor, PropertyGroup },
    componentProperties,
    propertiesMapper,
    debug,
    openEditor,
  } = useContext(ComponentsContext);
  const [requiredDisabled, setRequiredDisabled] = useState(true);
  useEffect(() => {
    if (selectedComponent) {
      setRequiredDisabled(() => checkRequiredDisabled(field));
    }
  }, [selectedComponent, field]);

  useEffect(() => {
    if (!selectedComponent && openEditor && dropTargets[FORM_LAYOUT].fieldsIds[0]) {
      dispatch({ type: SET_SELECTED_COMPONENT, payload: dropTargets[FORM_LAYOUT].fieldsIds[0] });
    }
  }, []);

  if (!selectedComponent) {
    return null;
  }
  const registeredFields = form?.getRegisteredFields();
  const interactiveField = registeredFields.includes(field.name || field.id);

  const properties = componentProperties[field.component].attributes;
  const disableInitialValue = !interactiveField || componentProperties[field.component].disableInitialValue;
  const disableValidators = !interactiveField || componentProperties[field.component].disableValidators;

  const validate = field.validate || [];
  const NameComponent = propertiesMapper.input;
  const InitialValueComponent = propertiesMapper.input;
  const MessageComponent = propertiesMapper.input;
  const IsRequiredComponent = propertiesMapper.switch;

  const handlePropertyChange = (value, propertyName) =>
    dispatch({
      type: SET_FIELD_PROPERTY,
      payload: {
        value: convertInitialValue(value, field.dataType),
        propertyName,
        fieldId: field.id,
      },
    });

  const handleValidatorChange = (value = {}, action, index) =>
    dispatch({
      type: SET_FIELD_VALIDATOR,
      payload: {
        ...value,
        fieldId: field.id,
        index,
        action,
      },
    });

  const requiredIndex = validate.reduce((acc, curr, index) => (curr.type === validatorTypes.REQUIRED ? index : acc), 0);

  const hasPropertyError = field.propertyValidation && Object.entries(field.propertyValidation).find(([, value]) => value);

  return (
    <Fragment>
      <PropertiesEditor
        fieldName={field.name}
        hasPropertyError={hasPropertyError}
        avaiableValidators={disableValidators ? [] : validatorOptions}
        addValidator={(type) => handleValidatorChange({ type }, 'add')}
        handleClose={() => dispatch({ type: SET_SELECTED_COMPONENT })}
        handleDelete={
          !field.restricted
            ? () =>
                dispatch({
                  type: REMOVE_COMPONENT,
                  payload: field.id,
                })
            : undefined
        }
        disableInitialValue={disableInitialValue}
        disableValidators={disableValidators}
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
            {!disableInitialValue && (
              <MemoizedProperty
                label="Initial value"
                type="text"
                Component={InitialValueComponent}
                handlePropertyChange={handlePropertyChange}
                property={{ propertyName: 'initialValue' }}
              />
            )}
            {properties.map((property) => {
              const Component = propertiesMapper[property.component];
              return (
                <MemoizedProperty
                  selectedComponent={field.id}
                  key={property.propertyName}
                  Component={Component}
                  property={property}
                  handlePropertyChange={handlePropertyChange}
                />
              );
            })}
          </Fragment>
        }
        validationChildren={
          disableValidators ? null : (
            <Fragment>
              <PropertyGroup title="required validator">
                <IsRequiredComponent
                  value={field.isRequired}
                  label="Required"
                  fieldId="required-validator"
                  isDisabled={requiredDisabled}
                  innerProps={{}}
                  onChange={(value) =>
                    handleValidatorChange(
                      {
                        type: validatorTypes.REQUIRED,
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
                          message: value,
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
          )
        }
      />
      {debug && <pre>{JSON.stringify(field, null, 2)}</pre>}
    </Fragment>
  );
};

export default PropertiesEditor;
