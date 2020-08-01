import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'

export default {
  input: 'src/index.ts',
  output: [
    // {
    //   file: 'dist/es/berial.esm.js',
    //   format: 'esm',
    //   sourcemap: true,
    //   name: 'berial'
    // },
    {
      file: 'dist/berial.js',
      format: 'umd',
      sourcemap: true,
      name: 'berial'
    }
  ],
  plugins: [
    replace({
      __DEV__: process.env.NODE_ENV !== 'production'
    }),
    typescript()
  ]
}
