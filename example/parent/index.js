import { start, register } from '../../dist/berial'
import { h, render } from 'fre'
import './index.css'

import App from './App'

const isProduction = process.env.NODE_ENV === 'production'

render(<App />, document.getElementById('app'))

register(
  'child-fre',
  isProduction
    ? 'https://berial-child-fre.vercel.app'
    : 'http://localhost:3001',
  (location) => location.pathname === '/'
)

register(
  'child-react',
  isProduction
    ? 'https://berial-child-react.vercel.app'
    : 'http://localhost:3002',
  (location) => /^\/react/.test(location.pathname)
)

register(
  'child-vue',
  isProduction
    ? 'https://berial-child-vue.vercel.app'
    : 'http://localhost:3003',
  (location) => /^\/vue/.test(location.pathname)
)

start()
