import React from 'react';
import ReactDom from 'react-dom'
import FormBuilder from '../src';

const Demo = () => {
    return (
        <FormBuilder />
    )
}

ReactDom.render(<Demo />, document.getElementById('root'));
