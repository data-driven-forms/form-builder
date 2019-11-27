import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Box from '@material-ui/core/Box';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { formFieldsMapper } from '@data-driven-forms/mui-component-mapper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const TextField = props => {
  const Component = formFieldsMapper[componentTypes.TEXT_FIELD];
  return (
    <div style={{
      position: 'relative',
      width: '100%',
    }}
    >
      <Component {...props} />
    </div>
  );
};

const FieldActions = ({ onSelect, onDelete, fieldData }) => (
  <ButtonGroup size="small" aria-label="small outlined button group">
    <Button onClick={onSelect} startIcon={<EditIcon />}>Edit</Button>
    <Button onClick={onDelete} startIcon={<DeleteIcon />}>Remove</Button>
  </ButtonGroup>
);

const FieldLayout = ({ children }) => (
  <Box display="flex" flexDirection="row" justifyContent="space-between" style={{ padding: 8 }}>
    {children}
  </Box>
);

const BuilderColumn = ({ children, ...props }) => (
  <Card {...props}>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

const builderMapper = {
  FieldActions,
  FieldLayout,
  [componentTypes.TEXT_FIELD]: TextField,
  BuilderColumn,
};

export default builderMapper;
