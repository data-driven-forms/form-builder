import React, { useContext, useState, useEffect, Fragment } from 'react';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';

import BuilderContext from '../builder-context';
import validatorsProperties from '../validators-properties';
import MemoizedProperty from './memoized-property';
import MemoizedValidator from './memozied-validator';
import { MAIN_CONTAINER } from '../backend';

const validatorOptions = Object.keys(validatorTypes)
  .filter((key) => validatorTypes[key] !== validatorTypes.REQUIRED)
  .map((key) => ({ value: validatorTypes[key], label: validatorTypes[key] }));

const checkRequiredDisabled = (field) => {
  return !!(field.restricted && !!field.validate && !!field.validate.find(({ type, original }) => original && type === validatorTypes.REQUIRED));
};

const PropertiesEditor = () => {
  const {
    builderMapper: { PropertiesEditor, PropertyGroup },
    componentProperties,
    propertiesMapper,
    debug,
    openEditor,
    fields,
    containers,
    selectedComponent,
    removeComponent,
    selectComponent,
    setFieldProperty,
    setFieldValidator,
  } = useContext(BuilderContext);

  const field = fields[selectedComponent];

  const [requiredDisabled, setRequiredDisabled] = useState(true);
  useEffect(() => {
    if (selectedComponent) {
      setRequiredDisabled(() => checkRequiredDisabled(field));
    }
  }, [selectedComponent, field]);

  useEffect(() => {
    if (!selectedComponent && openEditor && containers[MAIN_CONTAINER].children[0]) {
      selectComponent(containers[MAIN_CONTAINER].children[0]);
    }
  }, []);

  if (!selectedComponent) {
    return null;
  }
  const properties = componentProperties[field.component].attributes;
  const validate = field.validate || [];
  const NameComponent = propertiesMapper.input;
  const InitialValueComponent = propertiesMapper.input;
  const MessageComponent = propertiesMapper.input;
  const IsRequiredComponent = propertiesMapper.switch;

  const handlePropertyChange = (value, propertyName) => setFieldProperty(field.id, propertyName, value, field.dataType);

  const handleValidatorChange = (value = {}, action, index) => setFieldValidator(field.id, value, index, action);

  const requiredIndex = validate.reduce((acc, curr, index) => (curr.type === validatorTypes.REQUIRED ? index : acc), 0);

  const hasPropertyError = field.propertyValidation && Object.entries(field.propertyValidation).find(([, value]) => value);

  return (
    <Fragment>
      <PropertiesEditor
        fieldName={field.name}
        hasPropertyError={hasPropertyError}
        avaiableValidators={validatorOptions}
        addValidator={(type) => handleValidatorChange({ type }, 'add')}
        handleClose={() => selectComponent('')}
        handleDelete={!field.restricted ? () => removeComponent(field.id) : undefined}
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
        }
      />
      {debug && <pre>{JSON.stringify(field, null, 2)}</pre>}
    </Fragment>
  );
};

export default PropertiesEditor;
