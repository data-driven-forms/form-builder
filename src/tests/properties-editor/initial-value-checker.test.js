import propertiesValidation from '../../properties-editor/initial-value-checker';

describe('initial value checker', () => {
  it('should return an empty object for wrong validation type', () => {
    const field = {};
    const validator = propertiesValidation('non-sense');
    expect(validator(field)).toEqual({});
  });
  it('should return empty initial value key', () => {
    const field = {};
    const validator = propertiesValidation('isDisabled');
    expect(validator(field)).toEqual({ initialValue: undefined });
  });

  it('should return an error when field is required, disabled, read-only and hidden and has no initial value', () => {
    const conflictingAttributes = ['isDisabled', 'isReadOnly', 'hideField'];
    const propertyStrings = {
      isRequired: 'required',
      isDisabled: 'disabled',
      isReadOnly: 'read only',
      hideField: 'hidden'
    };
    conflictingAttributes.forEach((attribute) => {
      const field = {
        isRequired: true,
        [attribute]: true
      };
      const expectedError = {
        initialValue: {
          code: 'errors.initialValue',
          codeDependencies: {
            [attribute]: true,
            isRequired: true
          },
          message: `Initial value must be set if field is required and at the same time ${propertyStrings[attribute]}.`
        }
      };
      const validator = propertiesValidation(attribute);
      expect(validator(field)).toEqual(expectedError);
    });
  });
});
