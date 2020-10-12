import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

const PropertyComponent = memo(
  ({
    Component,
    property: { label, value, options, ...property },
    selectedComponent,
    handlePropertyChange,
    restricted,
    propertyValidation,
    ...props
  }) => {
    const innerProps = {
      property,
      restricted,
      propertyValidation,
      selectedComponent,
    };
    return (
      <Component
        label={label}
        value={value}
        options={options}
        {...props}
        innerProps={innerProps}
        fieldId={property.propertyName}
        onChange={(value) => handlePropertyChange(value, property.propertyName)}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.value === nextProps.value &&
    prevProps.restricted === nextProps.restricted &&
    prevProps.selectedComponent === nextProps.selectedComponent &&
    shallowEqual(prevProps.propertyValidation, nextProps.propertyValidation)
);

PropertyComponent.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.element]).isRequired,
  field: PropTypes.shape({
    restricted: PropTypes.bool,
  }),
  handlePropertyChange: PropTypes.func.isRequired,
  property: PropTypes.shape({
    propertyName: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.any,
    options: PropTypes.array,
  }).isRequired,
  restricted: PropTypes.bool,
  propertyValidation: PropTypes.shape({
    propertyValidation: PropTypes.object,
  }),
  selectedComponent: PropTypes.string,
};

const MemoizedProperty = (props) => {
  const { value, restricted, propertyValidation } = useSelector(({ fields, selectedComponent }) => {
    const field = fields[selectedComponent];
    return {
      value: field[props.property.propertyName],
      restricted: field.restricted,
      propertyValidation: field.propertyValidation && field.propertyValidation[props.property.propertyName],
    };
  }, shallowEqual);
  return <PropertyComponent {...props} value={value} restricted={restricted} propertyValidation={propertyValidation} />;
};

MemoizedProperty.propTypes = {
  property: PropTypes.shape({
    propertyName: PropTypes.string.isRequired,
  }).isRequired,
};

export default MemoizedProperty;
