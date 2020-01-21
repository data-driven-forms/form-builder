import React from 'react';
import PropTypes from 'prop-types';
import FormBuilder from './form-builder';
import ComponentsContext from './components-context';

export const COMPONENTS_LIST = 'components-list';
export const FORM_LAYOUT = 'form-layout';

/**
 * Returns a flat fields object to be rendered and edited in the editor
 * @param {Object} initialFields available field definitions in component chooser
 * @param {Object} schema data driven form schema
 * @param {Boolean} isSubset if true, options will be only editable to certain degree
 * @param {Object} schemaTemplate original from which a subset is created. If not specified, editable boundaries will be created from schema
 */
const createInitialData = (initialFields, schema, isSubset, schemaTemplate) => {
  const fields = {
    ...initialFields
  };
  const fieldsIds = [];
  if (schema && schema.fields) {
    schema.fields.forEach((field) => {
      const id = `${field.name}-${Date.now().toString()}`;
      fieldsIds.push(id);
      fields[id] = {
        ...field,
        id,
        clone: true,
        preview: false,
        initialized: true
      };
      if (isSubset) {
        let template;
        if (schemaTemplate) {
          template = schemaTemplate.fields.find(({ name }) => name === field.name);
        }
        fields[id] = {
          ...fields[id],
          restricted: true,
          validate: fields[id].validate
            ? fields[id].validate.map((validator, index) => ({
                ...validator,
                original: template
                  ? { ...template.validate[index] }
                  : { ...validator }
              }))
            : undefined
        };
      }
    });
  }

  return {
    fields,
    dropTargets: {
      [COMPONENTS_LIST]: {
        id: COMPONENTS_LIST,
        title: 'Component chooser',
        fieldsIds: Object.keys(initialFields)
      },
      [FORM_LAYOUT]: {
        id: FORM_LAYOUT,
        title: 'Form',
        fieldsIds
      }
    },
    selectedComponent: undefined,
    containers: []
  };
};

const ContainerEnd = ({ id }) => <div>{id}</div>;

const App = ({
  componentMapper,
  componentProperties,
  pickerMapper,
  propertiesMapper,
  cloneWhileDragging,
  schema,
  schemaTemplate,
  mode,
  debug,
  ...props
}) => {
  const initialFields = Object.keys(componentProperties).reduce(
    (acc, curr) => ({
      ...acc,
      [`initial-${curr}`]: {
        preview: true,
        id: `initial-${curr}`,
        component: curr,
        clone: cloneWhileDragging,
        isContainer: componentProperties[curr].isContainer
      }
    }),
    {}
  );
  return (
    <ComponentsContext.Provider
      value={{
        componentMapper: { ...componentMapper, 'container-end': ContainerEnd },
        componentProperties,
        pickerMapper,
        propertiesMapper,
        debug
      }}
    >
      <FormBuilder
        initialFields={createInitialData(
          initialFields,
          schema,
          mode === 'subset',
          schemaTemplate
        )}
        mode={mode}
        {...props}
      />
    </ComponentsContext.Provider>
  );
};

App.propTypes = {
  mode: PropTypes.oneOf(['default', 'subset']),
  debug: PropTypes.bool
};

App.defaultProps = {
  mode: 'default',
  debug: false
};

export default App;
