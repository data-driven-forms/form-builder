const propertyStrings = {
  isRequired: 'required',
  isDisabled: 'disabled',
  isReadOnly: 'read only',
  hideField: 'hidden'
};

const initialValueCheckMessage = ({ isDisabled, isReadOnly, hideField }) => {
  return `Initial value must be set if field is required and at the same time ${Object.entries(
    {
      isDisabled,
      isReadOnly,
      hideField
    }
  )
    .filter(([, value]) => value)
    .map(([key]) => propertyStrings[key])
    .join(' or ')}.`;
};

const initialValueCheck = ({
  initialValue,
  isRequired,
  isDisabled,
  isReadOnly,
  hideField
}) =>
  !initialValue && isRequired && (isDisabled || isReadOnly || hideField)
    ? {
        initialValue: {
          message: initialValueCheckMessage({
            isDisabled,
            isReadOnly,
            hideField
          }),
          code: 'errors.initialValue',
          codeDependencies: {
            isRequired,
            isDisabled,
            isReadOnly,
            hideField
          }
        }
      }
    : {
        initialValue: undefined
      };

const propertyValidationMapper = {
  isDisabled: initialValueCheck,
  isReadOnly: initialValueCheck,
  hideField: initialValueCheck,
  initialValue: initialValueCheck
};

const propertiesValidation = (type) => {
  const validation = propertyValidationMapper[type];
  return validation ? validation : () => ({});
};

export default propertiesValidation;
