import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ValidatorProperty from './validator-property';
import { useSelector, shallowEqual } from 'react-redux';

const ValidatorComponent = memo(
  ({ handleValidatorChange, property, original, validator, restricted, index }) => (
    <ValidatorProperty
      onChange={handleValidatorChange}
      property={{
        ...property,
        original,
      }}
      restricted={restricted}
      value={validator[property.propertyName]}
      index={index}
    />
  ),
  (prevProps, nextProps) => {
    const key = nextProps.property.propertyName;
    return prevProps.validator[key] === nextProps.validator[key];
  }
);

ValidatorComponent.propTypes = {
  handleValidatorChange: PropTypes.func.isRequired,
  property: PropTypes.shape({
    propertyName: PropTypes.string.isRequired,
  }).isRequired,
  original: PropTypes.object,
  validator: PropTypes.object,
  index: PropTypes.number.isRequired,
  restricted: PropTypes.bool,
};

const MemoizedValidator = (props) => {
  const restricted = useSelector(({ fields, selectedComponent }) => fields[selectedComponent].restricted, shallowEqual);
  return <ValidatorComponent {...props} restricted={restricted} />;
};

export default MemoizedValidator;
