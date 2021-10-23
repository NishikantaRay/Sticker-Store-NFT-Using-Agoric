import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'lib/ses-boot.js',
    output: {
      file: `dist/bundle-ses-boot.umd.js`,
      format: 'umd',
      name: 'Bootstrap',
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input: 'lib/ses-boot-debug.js',
    output: {
      file: `dist/bundle-ses-boot-debug.umd.js`,
      format: 'umd',
      name: 'Bootstrap',
    },
    plugins: [resolve(), commonjs()],
  },
];
