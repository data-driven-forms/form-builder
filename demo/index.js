import React from 'react';
import ReactDom from 'react-dom';
import FormBuilder from '../src/index.js';

const Demo = () => (
  <FormBuilder />
);

ReactDom.render(<Demo />, document.getElementById('root'));
