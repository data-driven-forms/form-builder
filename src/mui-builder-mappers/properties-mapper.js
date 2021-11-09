/* eslint react/no-array-index-key: "off" */
import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';

import { TextField, FormLabel, FormControl, FormGroup, FormControlLabel, FormHelperText, Switch, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import AddIcon from '@mui/icons-material/Add';
import { red, blue } from '@mui/material/colors';

const Input = ({ value, fieldId, onChange, innerProps: { propertyValidation = {} }, isDisabled, helperText, ...rest }) => (
  <TextField
    id={fieldId}
    value={typeof value === undefined ? '' : value.toString()}
    onChange={(e) => onChange(e.target.value)}
    disabled={isDisabled}
    helperText={propertyValidation.message || helperText}
    error={Boolean(propertyValidation.message)}
    {...rest}
  />
);

Input.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string]).isRequired,
  helperText: PropTypes.node,
  value: PropTypes.any,
  fieldId: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    propertyValidation: PropTypes.shape({ message: PropTypes.string }),
  }).isRequired,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
};

Input.defaultProps = {
  onChange: () => {},
  value: '',
};

const PropertySwitch = ({ label, value, fieldId, innerProps: { propertyValidation = {} }, helperText, onChange, isDisabled }) => (
  <FormControl required error={Boolean(propertyValidation.message)} component="fieldset">
    <FormGroup row>
      <FormControlLabel
        id={fieldId}
        disabled={isDisabled}
        control={<Switch checked={Boolean(value)} onChange={(_e, value) => onChange(value)} value={value} />}
        label={label}
      />
      <FormHelperText>{propertyValidation.message || helperText}</FormHelperText>
    </FormGroup>
  </FormControl>
);

PropertySwitch.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  fieldId: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    propertyValidation: PropTypes.shape({ message: PropTypes.string }),
  }).isRequired,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  helperText: PropTypes.node,
};

PropertySwitch.defaultProps = {
  value: false,
};

const PropertySelect = ({ value, fieldId, onChange, innerProps: { propertyValidation = {} }, isDisabled, helperText, options, ...rest }) => (
  <TextField
    select
    id={fieldId}
    value={value ? value : ''}
    onChange={(e) => onChange(e.target.value)}
    disabled={isDisabled}
    helperText={propertyValidation.message || helperText}
    error={Boolean(propertyValidation.message)}
    {...rest}
  >
    {options.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
);

PropertySelect.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string]).isRequired,
  helperText: PropTypes.node,
  value: PropTypes.any,
  fieldId: PropTypes.string.isRequired,
  innerProps: PropTypes.shape({
    propertyValidation: PropTypes.shape({ message: PropTypes.string }),
  }).isRequired,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.string),
};

PropertySelect.defaultProps = {
  onChange: () => {},
  options: [],
};

const Root = styled('div')(() => ({
  '& .remove': {
    '&:hover': {
      color: red[500],
    },
  },
  '& .restore': {
    '&:hover': {
      color: blue[500],
    },
  },
  '& .cell': {
    '&:not(:last-child)': {
      'padding-right': 8,
    },
  },
}));

const PropertyOptions = ({ value = [], label, onChange, innerProps: { restricted } }) => {
  const handleOptionChange = (option, index, optionKey) =>
    onChange(value.map((item, itemIndex) => (index === itemIndex ? { ...item, [optionKey]: option } : item)));

  const handleRemove = (index, restoreable) => {
    let options;

    if (restoreable) {
      options = value.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              deleted: !item.deleted,
            }
          : item
      );
    } else {
      options = value.filter((_item, itemIndex) => itemIndex !== index);
    }
    return onChange(options.length > 0 ? options : undefined);
  };

  return (
    <Root>
      <p
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <FormLabel>{label}</FormLabel>
        {!restricted && (
          <IconButton onClick={() => onChange([...value, { value: '', label: '' }])} aria-label="add option" size="large">
            <AddIcon />
          </IconButton>
        )}
      </p>
      <table>
        <tbody>
          {value.map(({ label, value, restoreable, deleted }, index, allOptions) => (
            <tr key={index}>
              <td className="cell">
                <TextField
                  value={label || ''}
                  onChange={(e) => handleOptionChange(e.target.value, index, 'label')}
                  disabled={deleted}
                  placeholder="Label"
                  aria-label={`option-label-${index}`}
                />
              </td>
              <td className="cell">
                <TextField
                  onKeyPress={({ key }) => {
                    if (key === 'Enter' && index === allOptions.length - 1) {
                      onChange([...allOptions, { value: '', label: '' }]);
                    }
                  }}
                  value={value || ''}
                  onChange={(e) => handleOptionChange(e.target.value, index, 'value')}
                  disabled={deleted}
                  placeholder="Value"
                  aria-label={`option-value-${index}`}
                />
              </td>
              <td>
                <IconButton onClick={() => handleRemove(index, restoreable)} variant="plain" aria-label="delete option" size="large">
                  {deleted ? <RestoreFromTrashIcon className="restore" /> : <DeleteIcon className="remove" />}
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Root>
  );
};

PropertyOptions.propTypes = {
  value: PropTypes.array,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  innerProps: PropTypes.shape({ restricted: PropTypes.bool }).isRequired,
};

const Textarea = (props) => <Input {...props} multiline />;

const propertiesMapper = {
  input: Input,
  switch: PropertySwitch,
  select: PropertySelect,
  options: PropertyOptions,
  textarea: Textarea,
};

export default propertiesMapper;
