import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import dtsPlugin from 'rollup-plugin-dts'

function createConfig(dts) {
  let file = `dist/${dts ? 'types/index.d.ts' : 'berial.js'}`
  return {
    input: 'src/index.ts',
    output: {
      format: 'umd',
      file,
      sourcemap: !dts,
      name: 'berial'
    },
    plugins: [
      !dts && replace({
        __DEV__: process.env.NODE_ENV !== 'production'
      }),
      !dts && typescript({
        tsconfig: 'tsconfig.json',
        removeComments: true,
        useTsconfigDeclarationDir: true
      }),
      dts && dtsPlugin()
    ].filter(Boolean)
  }
}

export default [
  createConfig(),
  createConfig(true)
]
