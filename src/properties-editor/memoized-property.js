import React, { memo } from 'react';
import PropTypes from 'prop-types';

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
      nextProps.field[nextProps.property.propertyName] &&
    prevProps.field.propertyValidation &&
    prevProps.field.propertyValidation[nextProps.property.propertyName] ===
      nextProps.field.propertyValidation &&
    nextProps.field.propertyValidation[nextProps.property.propertyName]
);

export default MemoizedProperty;
