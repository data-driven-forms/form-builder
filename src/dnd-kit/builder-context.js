import { createContext } from 'react';
import { MAIN_CONTAINER } from './backend';

const BuilderContext = createContext({
  templates: {},
  fields: {},
  pickerMapper: {},
  componentMapper: {},
  builderMapper: {},
  selectedComponent: undefined,
  selectComponent: () => undefined,
  containers: {
    [MAIN_CONTAINER]: {
      children: [],
    },
  },
});

export const BuilderProvider = BuilderContext.Provider;
export default BuilderContext;