import { createElement } from 'react';

const MockFieldProvider = ({
  validate,
  input,
  render,
  meta,
  component,
  children,
  ...rest
}) => {
  const fieldInput = {
    onChange: console.log,
    ...input
  };
  const fieldMeta = {
    ...meta
  };

  if (typeof children === 'function') {
    return children({ ...rest, input: fieldInput, meta: fieldMeta });
  }

  if (typeof component === 'object') {
    return createElement(component, {
      ...rest,
      input: fieldInput,
      meta: fieldMeta,
      children
    });
  }

  return render({
    ...rest,
    input: fieldInput,
    meta: fieldMeta,
    children
  });
};

export default MockFieldProvider;
