import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM'
};

const babelOptions = {
  exclude: /node_modules/,
  runtimeHelpers: true,
  configFile: './.babelrc'
};

const commonjsOptions = {
  ignoreGlobal: true,
  namedExports: {
    'node_modules/react-is/index.js': ['isValidElementType', 'isContextConsumer']
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
      })
    ]
  }
];
