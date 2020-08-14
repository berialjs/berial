import { register, start } from '../../dist/berial'
import { h, render } from 'fre'
import './index.css'

import App from './App'

render(<App />, document.getElementById('app'))

register(
  'child-fre',
  'http://localhost:3001',
  (location) => location.pathname === '/'
)

register(
  'child-react',
  'http://localhost:3002',
  (location) => /^\/react/.test(location.pathname)
)

register(
  'child-vue',
  'http://localhost:3003',
  (location) => /^\/vue/.test(location.pathname)
)

start()
