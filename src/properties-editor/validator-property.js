import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ComponentsContext from '../components-context';

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

const ValidatorProperty = ({ property, onChange, value, index, restricted }) => {
  const { propertiesMapper } = useContext(ComponentsContext);
  const Component = propertiesMapper[property.component];
  const { isDisabled, restrictionProperty } =
    property.restriction && property.original
      ? {
          isDisabled: property.restriction.lock,
          [property.restriction.inputAttribute]:
            property.original[property.restriction.validatorAttribute]
        }
      : {};

  const innerProps = {
    property: restrictionProperty,
    restricted
  };
  return (
    <Component
      value={value}
      type={property.type}
      isDisabled={isDisabled}
      onBlur={() =>
        property.propertyName !== 'message' &&
        restricted &&
        onChange(validatorChangeValue(property, value), 'modify', index)
      }
      fieldId={`${property.propertyName}-${index}`}
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
      innerProps={innerProps}
    />
  );
};

ValidatorProperty.propTypes = {
  restricted: PropTypes.bool,
  property: PropTypes.shape({
    original: PropTypes.object,
    propertyName: PropTypes.string.isRequired,
    component: PropTypes.string.isRequired,
    type: PropTypes.string,
    label: PropTypes.string.isRequired,
    restriction: PropTypes.shape({
      inputAttribute: PropTypes.string,
      validatorAttribute: PropTypes.string,
      lock: PropTypes.bool
    })
  }),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  index: PropTypes.number.isRequired
};

export default ValidatorProperty;
