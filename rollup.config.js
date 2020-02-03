import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { createFilter } from 'rollup-pluginutils';
import postcss from 'rollup-plugin-postcss';

const externals = createFilter(
  [
    'react',
    'react-dom',
    'prop-types',
    '@data-driven-forms/react-form-renderer',
    '@patternfly/react-core/**',
    '@patternfly/react-icons/**'
  ],
  null,
  { resolve: false }
);

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
  '@patternfly/react-core': 'PatternflyReact',
  '@patternfly/react-icons': 'ReactIcons',
  '@data-driven-forms/react-form-renderer': '@data-driven-forms/react-form-renderer',
  '@data-driven-forms/pf4-component-mapper':
    '@data-driven-forms/pf4-component-mapper'
};

const babelOptions = {
  exclude: /node_modules/,
  runtimeHelpers: true,
  configFile: './.babelrc'
};

const commonjsOptions = {
  ignoreGlobal: true,
  namedExports: {
    'node_modules/react-is/index.js': ['isValidElementType', 'isContextConsumer'],
    'node_modules/@data-driven-forms/pf4-component-mapper/dist/index.js': [
      'formFieldsMapper',
      'rawComponents'
    ]
  }
};

function onwarn(warning) {
  throw Error(warning.message);
}

export default [
  {
    onwarn,
    input: './src/index.js',
    output: {
      file: './dist/index.js',
      format: 'umd',
      name: '@data-driven-forms/form-builder',
      exports: 'named',
      globals
    },
    external: externals,
    plugins: [
      nodeResolve(),
      babel(babelOptions),
      commonjs(commonjsOptions),
      nodeGlobals(), // Wait for https://github.com/cssinjs/jss/pull/893
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      terser({
        keep_classnames: true,
        keep_fnames: true
      }),
      postcss({
        inject: true
      }),
      sizeSnapshot()
    ]
  },
  {
    onwarn,
    input: './pf4-mappers/index.js',
    output: {
      file: './dist/pf4-builder-mappers.js',
      format: 'umd',
      name: '@data-driven-forms/form-builder-pf4-mappers',
      exports: 'named',
      globals
    },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(babelOptions),
      commonjs(commonjsOptions),
      nodeGlobals(), // Wait for https://github.com/cssinjs/jss/pull/893
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      terser({
        keep_classnames: true,
        keep_fnames: true
      }),
      postcss({
        inject: true
      }),
      sizeSnapshot()
    ]
  }
];
