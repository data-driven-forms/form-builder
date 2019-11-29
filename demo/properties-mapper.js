/* eslint react/no-array-index-key: "off" */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import red from '@material-ui/core/colors/red';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


const useInputStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    marginTop: 8,
  },
  formControl: {
    marginTop: 8,
    width: '100%',
  },
  danger: {
    color: red[500],
  },
}));


const Input = ({
  label,
  onChange,
  value,
  autoFocus
}) => {
  const classes = useInputStyles();
  return (
    <div className={classes.root}>
      <TextField
        autoFocus={autoFocus}
        fullWidth
        label={label}
        onChange={({ target: { value } }) => onChange(value)}
        value={value || ''}
      />
    </div>
  );
};

const PropertySwitch = ({
  value,
  onChange,
  label,
}) => {
  const classes = useInputStyles();
  return (
    <div className={classes.root}>
      <FormControlLabel
        control={(
          <Switch
            checked={Boolean(value)}
            onChange={({ target: { checked } }) => onChange(checked)}
          />
        )}
        label={label}
      />
    </div>
  );
};

const PropertySelect = ({
  value,
  label,
  onChange,
  options,
}) => {
  const classes = useInputStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={`${label}-selection`}>{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value || ''}
        onChange={({ target: { value } }) => onChange(value)}
      >
        {options.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
      </Select>
    </FormControl>
  );
};

const PropertyOptions = ({ value = [], label, onChange }) => {
  const classes = useInputStyles();
  const handleOptionChange = (option, index, optionKey) => onChange(
    value.map((item, itemIndex) => index === itemIndex ? ({ ...item, [optionKey]: option }) : item),
  );
  const handleRemove = index => {
    const options = value.filter((_item, itemIndex) => itemIndex !== index);
    return onChange(options.length > 0 ? options : undefined);
  };
  return (
    <div>
      <Box component="p" display="flex" justifyContent="flex-start" alignItems="center">
        <span>
          {label}
        </span>
        <IconButton onClick={() => onChange([...value, { value: '', label: '' }])} color="primary" aria-label="delete option" component="span">
          <AddIcon />
        </IconButton>
      </Box>
      <table>
        {value.map(({ label, value }, index, allOptions) => (
          <tbody key={index}>
            <tr>
              <td>
                <TextField autoFocus placeholder="Label" onChange={({ target: { value } }) => handleOptionChange(value, index, 'label')} value={label || ''} type="text" />
              </td>
              <td>
                <TextField
                  onKeyPress={({ key }) => {
                    if (key === 'Enter' && index === allOptions.length - 1) {
                      onChange([...allOptions, { value: '', label: '' }]);
                    }
                  }}
                  placeholder="Value"
                  onChange={({ target: { value } }) => handleOptionChange(value, index, 'value')}
                  value={value || ''}
                  type="text"
                />
              </td>
              <td>
                <IconButton className={classes.danger} onClick={() => handleRemove(index)} color="secondary" aria-label="delete option" component="span">
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

const propertiesMapper = {
  input: Input,
  switch: PropertySwitch,
  select: PropertySelect,
  options: PropertyOptions,
};

export default propertiesMapper;
