import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    format: 'umd',
    file,
    sourcemap: true,
    name: 'berial',
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      removeComments: true,
      useTsconfigDeclarationDir: true,
    }),
  ],
}
