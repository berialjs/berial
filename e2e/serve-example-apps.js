/* eslint-disable @typescript-eslint/explicit-function-return-type */
const execa = require('execa')
const path = require('path')
const httpServer = require('http-server')

const appDirs = [
  'example/child-fre',
  'example/child-react',
  'example/child-vue',
  'example/parent'
]

module.exports = async () => {
  console.log('[e2e test]: start building apps')
  const appAbsoluteDirs = appDirs.map((dir) =>
    path.resolve(__dirname, '..', dir)
  )
  await Promise.all(
    appAbsoluteDirs.map((dir) => {
      return new Promise((resolve, reject) => {
        return execa('npm', ['run', 'build:test'], {
          cwd: dir,
          env: process.env
        }).then(() => resolve())
      })
    })
  )
  console.log('[e2e test]: end building apps')
  const servers = []
  appAbsoluteDirs.forEach((dir) => {
    const serverPort = require(path.resolve(dir, 'webpack.config.js')).devServer
      .port
    const server = httpServer.createServer({
      root: path.resolve(dir, 'dist'),
      cors: true,
      corsHeaders: '*'
    })
    server.listen(serverPort)
    servers.push(server)
    console.log('[e2e test]: start listen', serverPort)
  })
  return servers
}
