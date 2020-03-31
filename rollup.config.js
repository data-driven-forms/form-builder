import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import { createFilter } from 'rollup-pluginutils';
import postcss from 'rollup-plugin-postcss';
import sourcemaps from 'rollup-plugin-sourcemaps';

const externals = createFilter(
  [
    'react',
    'react-dom',
    'prop-types',
    '@data-driven-forms/react-form-renderer',
    '@data-driven-forms/react-form-renderer/**',
    '@patternfly/react-core/**',
    '@patternfly/react-icons/**',
    '@material-ui/core/**',
    '@material-ui/styles/**',
    '@material-ui/icons/**',
    '@data-driven-forms/**'
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
  '@data-driven-forms/pf4-component-mapper': '@data-driven-forms/pf4-component-mapper',
  '@data-driven-forms/mui-component-mapper': '@data-driven-forms/mui-component-mapper',
  '@material-ui/core': '@material-ui/core',
  '@material-ui/utils': '@material-ui/utils'
};

const babelOptions = {
  exclude: /node_modules/,
  runtimeHelpers: true,
  configFile: './babel.config.js'
};

const commonjsOptions = {
  ignoreGlobal: true,
  namedExports: {
    'node_modules/react-is/index.js': ['isValidElementType', 'isContextConsumer']
  }
};

const plugins = [
  sourcemaps(),
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
  })
];

const outputPaths = ['./mui-mappers/mui-builder-mappers.js', './pf4-mappers/pf4-builder-mappers.js', './src/index.js'];
export default {
  input: outputPaths,
  output: { dir: `./dist/${process.env.FORMAT}`, name: '@data-driven-forms/form-builder', exports: 'named', globals, sourcemap: true },
  external: externals,
  plugins
};
