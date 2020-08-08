import { register, start } from '../../dist/berial'

register(
  'two-app',
  'http://localhost:3002',
  (location) => location.pathname === '/'
)
start()
