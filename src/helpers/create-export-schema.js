const ARTIFICIAL_KEYS = [
  'preview',
  'clone',
  'initialized',
  'id',
  'isContainer',
  'children',
  'container',
  'restricted',
  'propertyValidation'
];

const sanitizeField = (field) => {
  const result = { ...field };
  ARTIFICIAL_KEYS.forEach((key) => {
    delete result[key];
  });
  if (result.options) {
    result.options = result.options
      .filter(({ deleted }) => !deleted)
      .map(({ restoreable, ...option }) => option);
  }
  return result;
};

const createSchema = (fields) => {
  const keys = Object.keys(fields).filter((key) => !key.match(/^initial-/));
  const invalid = Object.keys(fields).find(
    (key) =>
      fields[key].propertyValidation &&
      Object.keys(fields[key].propertyValidation).length > 0 &&
      Object.entries(fields[key].propertyValidation).find(([, value]) => value)
  );
  return [
    {
      fields: keys.map((key) => sanitizeField(fields[key]))
    },
    !invalid
  ];
};

export default createSchema;
