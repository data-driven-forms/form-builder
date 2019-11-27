import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const FieldActions = ({ onSelect, onDelete, fieldData }) => {
  console.log(onSelect);
  return (
    <ButtonGroup size="small" aria-label="small outlined button group">
      <Button onClick={onSelect} startIcon={<EditIcon />}>Edit</Button>
      <Button onClick={onDelete} startIcon={<DeleteIcon />}>Remove</Button>
    </ButtonGroup>
  );
};

const builderMapper = {
  FieldActions,
};

export default builderMapper;
