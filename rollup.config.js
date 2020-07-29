import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    sourcemap: true,
    name: 'berial'
  },
  plugins: [typescript()]
}
