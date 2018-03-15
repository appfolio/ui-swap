import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

export default {
  input: 'index.js',
  output: {
    name: 'UISwap',
    format: 'iife',
    file:
      process.env.NODE_ENV === 'production'
        ? 'dist/index.min.js'
        : 'dist/index.js'
  },
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        [
          'env',
          {
            modules: false
          }
        ]
      ],
      plugins: ['external-helpers']
    }),
    process.env.NODE_ENV === 'production' && uglify()
  ]
};
