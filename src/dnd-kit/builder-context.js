import { createContext } from 'react';
import { MAIN_CONTAINER } from './backend';

const BuilderContext = createContext({
  templates: {},
  fields: {},
  containers: {
    [MAIN_CONTAINER]: {
      children: [],
    },
  },
});

export const BuilderProvider = BuilderContext.Provider;
export default BuilderContext;
