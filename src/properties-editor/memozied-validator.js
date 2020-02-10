import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ValidatorProperty from './validator-property';

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

const MemoizedValidator = memo(
  ValidatorComponent,
  (prevProps, nextProps) =>
    prevProps.field.name === nextProps.field.name &&
    prevProps.validator[prevProps.property.propertyName] ===
      nextProps.validator[nextProps.property.propertyName]
);

export default MemoizedValidator;
