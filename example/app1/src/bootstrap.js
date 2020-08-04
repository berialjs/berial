import { register, start } from '../../../dist/berial'
import Lifecycles from 'app2/lifecycle'

register(
  'one-app',
  async () => {
    return Lifecycles
  },
  (location) => location.pathname === '/'
)

start()
