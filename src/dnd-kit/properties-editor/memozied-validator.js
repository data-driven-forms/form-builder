import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import ValidatorProperty from './validator-property';
import BuilderContext from '../builder-context';

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
  const { fields, selectedComponent } = useContext(BuilderContext);
  const field = fields[selectedComponent];
  return <ValidatorComponent {...props} restricted={field.restricted} />;
};

export default MemoizedValidator;
