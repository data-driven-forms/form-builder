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
        let templateOptions = fields[id].options && fields[id].options.map((option) => ({ ...option, restoreable: true }));
        if (schemaTemplate) {
          template = schemaTemplate.fields.find(({ name }) => name === field.name);
        }
        if (template && template.options) {
          template.options.forEach((option) => {
            if (!templateOptions.find(({ value }) => value === option.value)) {
              templateOptions.push({ ...option, restoreable: true, deleted: true });
            }
          });
        }
        fields[id] = {
          ...fields[id],
          restricted: true,
          options: templateOptions,
          validate: fields[id].validate
            ? fields[id].validate.map((validator, index) => ({
                ...validator,
                original: template ? { ...template.validate[index] } : { ...validator }
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
        title: 'Component picker',
        fieldsIds: Object.keys(initialFields)
      },
      [FORM_LAYOUT]: {
        id: FORM_LAYOUT,
        title: 'Form',
        fieldsIds
      }
    },
    selectedComponent: undefined
  };
};

export default createInitialData;
