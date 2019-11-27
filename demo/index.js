import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormBuilder from '../src/index';
import builderMapper from './builder-mapper';

const Demo = () => (
  <Fragment>
    <CssBaseline />
    <ThemeProvider theme={createMuiTheme({})}>
      <FormBuilder componentMapper={builderMapper} />
    </ThemeProvider>
  </Fragment>
);

ReactDom.render(<Demo />, document.getElementById('root'));
