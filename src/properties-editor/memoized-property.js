import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

const PropertyComponent = memo(
  ({ Component, property, handlePropertyChange, ...props }) => {
    return (
      <Component
        {...props}
        {...property}
        fieldId={`${property.propertyName}`}
        onChange={(value) => handlePropertyChange(value, property.propertyName)}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.value === nextProps.value &&
    prevProps.restricted === nextProps.restricted &&
    shallowEqual(prevProps.propertyValidation, nextProps.propertyValidation)
);

PropertyComponent.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.element])
    .isRequired,
  property: PropTypes.shape({ propertyName: PropTypes.string.isRequired })
    .isRequired,
  field: PropTypes.shape({
    propertyValidation: PropTypes.object,
    restricted: PropTypes.bool
  }),
  handlePropertyChange: PropTypes.func.isRequired
};

const MemoizedProperty = (props) => {
  const { value, restricted, propertyValidation } = useSelector(
    ({ fields, selectedComponent }) => {
      const field = fields[selectedComponent];
      return {
        value: field[props.property.propertyName],
        restricted: field.restricted,
        propertyValidation:
          field.propertyValidation &&
          field.propertyValidation[props.property.propertyName]
      };
    },
    shallowEqual
  );
  return (
    <PropertyComponent
      {...props}
      value={value}
      restricted={restricted}
      propertyValidation={propertyValidation}
    />
  );
};

MemoizedProperty.propTypes = {
  property: PropTypes.shape({ propertyName: PropTypes.string.isRequired }).isRequired
};

export default MemoizedProperty;
