import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const useInputStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    marginTop: 8,
  },
  formControl: {
    marginTop: 8,
    width: '100%',
  },
}));


const Input = ({
  label,
  onChange,
  value,
}) => {
  const classes = useInputStyles();
  return (
    <div className={classes.root}>
      <TextField
        fullWidth
        label={label}
        onChange={({ target: { value } }) => onChange(value)}
        value={value}
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
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
      >
        {options.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
      </Select>
    </FormControl>
  );
};

const propertiesMapper = {
  input: Input,
  switch: PropertySwitch,
  select: PropertySelect,
};

export default propertiesMapper;
