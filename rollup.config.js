import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const isProduction = process.env.NODE_ENV === 'production'

const output = {
  format: 'iife',
  sourcemap: isProduction ? null : true,
};

const plugins = [
    commonjs({
      include: 'node_modules/**',
      sourcmap: !isProduction
    }),
    resolve({
      extensions: ['.js', '.jsx'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    isProduction && terser(),
];

export default [{
  input: 'src/scripts/main.app.js',
  output,
  plugins,
}];
