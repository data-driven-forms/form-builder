require.extensions['.css'] = () => undefined;
const path = require('path');
const glob = require('glob');

const mapper = {
  TextVariants: 'Text',
  ButtonVariant: 'Button',
  DropdownPosition: 'dropdownConstants',
  TextListVariants: 'TextList',
  TextListItemVariants: 'TextListItem'
};

const camelToSnake = (string) => {
  return string
    .replace(/[\w]([A-Z])/g, function(m) {
      return m[0] + '-' + m[1];
    })
    .toLowerCase();
};

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['@babel/plugin-syntax-dynamic-import', 'lodash', '@babel/plugin-proposal-class-properties'],
  env: {
    cjs: {
      plugins: [
        [
          'transform-imports',
          {
            '@data-driven-forms/react-form-renderer': {
              transform: (importName) => `@data-driven-forms/react-form-renderer/dist/cjs/${camelToSnake(importName)}`,
              preventFullImport: true
            }
          },
          '@data-driven-forms/react-form-renderer-CJS'
        ],
        [
          'transform-imports',
          {
            '@patternfly/react-core': {
              transform: (importName) => {
                let res;
                const files = glob.sync(
                  path.resolve(__dirname, `./node_modules/@patternfly/react-core/dist/js/**/${mapper[importName] || importName}.js`)
                );
                if (files.length > 0) {
                  res = files[0];
                } else {
                  throw new Error(`File with importName ${importName} does not exist`);
                }

                res = res.replace(path.resolve(__dirname, './node_modules/'), '');
                res = res.replace(/^\//, '');
                return res;
              },
              preventFullImport: false,
              skipDefaultConversion: true
            }
          },
          'react-core-CJS'
        ],
        [
          'transform-imports',
          {
            '@patternfly/react-icons': {
              transform: (importName) =>
                `@patternfly/react-icons/dist/js/icons/${importName
                  .split(/(?=[A-Z])/)
                  .join('-')
                  .toLowerCase()}`,
              preventFullImport: true
            }
          },
          'react-icons-CJS'
        ],
        [
          'transform-imports',
          {
            'patternfly-react': {
              transform: (importName) => {
                let res;
                const files = glob.sync(path.resolve(__dirname, `./node_modules/patternfly-react/dist/js/**/${importName}.js`));
                if (files.length > 0) {
                  res = files[0];
                } else {
                  throw new Error(`File with importName ${importName} does not exist`);
                }

                res = res.replace(path.resolve(__dirname, './node_modules/'), '');
                res = res.replace(/^\//, '');
                return res;
              },
              preventFullImport: false,
              skipDefaultConversion: false
            }
          },
          'pf3-react-CJS'
        ],
        [
          'transform-imports',
          {
            '@material-ui/core': {
              transform: (importName) => `@material-ui/core/${importName}`,
              preventFullImport: false,
              skipDefaultConversion: false
            }
          },
          'MUI-CJS'
        ],
        [
          'transform-imports',
          {
            '@data-driven-forms/pf4-component-mapper': {
              transform: (importName) => `@data-driven-forms/pf4-component-mapper/dist/cjs/${camelToSnake(importName)}`,
              preventFullImport: true
            }
          },
          '@data-driven-forms/pf4-component-mapper-CJS'
        ],
        [
          'transform-imports',
          {
            '@data-driven-forms/mui-component-mapper': {
              transform: (importName) => `@data-driven-forms/mui-component-mapper/dist/cjs/${camelToSnake(importName)}`,
              preventFullImport: true
            }
          },
          '@data-driven-forms/mui-component-mapper-CJS'
        ]
      ]
    },
    esm: {
      plugins: [
        [
          'transform-imports',
          {
            '@data-driven-forms/react-form-renderer': {
              transform: (importName) => `@data-driven-forms/react-form-renderer/dist/esm/${camelToSnake(importName)}`,
              preventFullImport: true
            }
          },
          '@data-driven-forms/react-form-renderer-ESM'
        ],
        [
          'transform-imports',
          {
            '@patternfly/react-core': {
              transform: (importName) => {
                let res;
                const files = glob.sync(
                  path.resolve(__dirname, `./node_modules/@patternfly/react-core/dist/esm/**/${mapper[importName] || importName}.js`)
                );
                if (files.length > 0) {
                  res = files[0];
                } else {
                  throw new Error(`File with importName ${importName} does not exist`);
                }

                res = res.replace(path.resolve(__dirname, './node_modules/'), '');
                res = res.replace(/^\//, '');
                return res;
              },
              preventFullImport: false,
              skipDefaultConversion: true
            }
          },
          'react-core-ESM'
        ],

        [
          'transform-imports',
          {
            '@patternfly/react-icons': {
              transform: (importName) =>
                `@patternfly/react-icons/dist/esm/icons/${importName
                  .split(/(?=[A-Z])/)
                  .join('-')
                  .toLowerCase()}`,
              preventFullImport: true
            }
          },
          'react-icons-ESM'
        ],
        [
          'transform-imports',
          {
            'patternfly-react': {
              transform: (importName) => {
                let res;
                const files = glob.sync(path.resolve(__dirname, `./node_modules/patternfly-react/dist/esm/**/${importName}.js`));
                if (files.length > 0) {
                  res = files[0];
                } else {
                  throw new Error(`File with importName ${importName} does not exist`);
                }

                res = res.replace(path.resolve(__dirname, './node_modules/'), '');
                res = res.replace(/^\//, '');
                return res;
              },
              preventFullImport: false,
              skipDefaultConversion: false
            }
          },
          'pf3-react-ESM'
        ],
        [
          'transform-imports',
          {
            '@material-ui/core': {
              transform: (importName) => `@material-ui/core/esm/${importName}`,
              preventFullImport: false,
              skipDefaultConversion: false
            }
          },
          'MUI-ESM'
        ],
        [
          'transform-imports',
          {
            '@data-driven-forms/pf4-component-mapper': {
              transform: (importName) => `@data-driven-forms/pf4-component-mapper/dist/esm/${camelToSnake(importName)}`,
              preventFullImport: true
            }
          },
          '@data-driven-forms/pf4-component-mapper-ESM'
        ],
        [
          'transform-imports',
          {
            '@data-driven-forms/mui-component-mapper': {
              transform: (importName) => `@data-driven-forms/mui-component-mapper/dist/esm/${camelToSnake(importName)}`,
              preventFullImport: true
            }
          },
          '@data-driven-forms/mui-component-mapper-ESm'
        ]
      ]
    }
  }
};
