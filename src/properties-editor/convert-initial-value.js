import { dataTypes } from '@data-driven-forms/react-form-renderer';

const castToBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  return value === 'true';
};

const convertType = (dataType, value) =>
  ({
    [dataTypes.INTEGER]: !isNaN(Number(value)) && parseInt(value),
    [dataTypes.FLOAT]: !isNaN(Number(value)) && parseFloat(value),
    [dataTypes.NUMBER]: Number(value),
    [dataTypes.BOOLEAN]: castToBoolean(value)
  }[dataType] || value);

const convertInitialValue = (initialValue, dataType) => {
  if (initialValue === undefined || !dataType) {
    return initialValue;
  }

  if (Array.isArray(initialValue)) {
    return initialValue.map((value) =>
      typeof value === 'object'
        ? {
            ...value,
            value: Object.prototype.hasOwnProperty.call(value, 'value') ? convertType(dataType, value.value) : value
          }
        : convertType(dataType, value)
    );
  }

  return convertType(dataType, initialValue);
};

export default convertInitialValue;
