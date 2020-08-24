import typescript from 'rollup-plugin-typescript2'

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
    typescript({
      tsconfig: 'tsconfig.json',
      removeComments: true,
      useTsconfigDeclarationDir: true,
    }),
  ]
}
