import createSchema, { validateOutput } from '../../helpers/create-export-schema';
import { fields, invalidSchema, schemaWithDeletedOption } from '../__mocks__/builder-fields';

describe('create export schema', () => {
  it('should create data driven from schema from flat object', () => {
    const expectedSchema = {
      fields: [
        {
          name: 'only-name'
        },
        {
          name: 'foo',
          label: 'Text field',
          isRequired: true,
          validate: [{ type: 'required-validator' }]
        }
      ]
    };
    expect(createSchema(['should-remove-all-attributes', '123-text-field'], fields)).toEqual(expectedSchema);
  });

  it('should check for builder validation errors', () => {
    expect(validateOutput(fields)).toEqual(true);
    expect(validateOutput(invalidSchema)).toEqual(false);
  });

  it('should sanitize deleted options', () => {
    const expectedSchema = {
      fields: [
        {
          name: 'deleted-option-field',
          options: [
            {
              value: 'bar',
              label: 'bar'
            }
          ]
        }
      ]
    };
    expect(createSchema(['deleted-option-field'], schemaWithDeletedOption)).toEqual(expectedSchema);
  });
});
