import { h, render } from 'fre'
import './index.css'
import { register } from '../dist/berial.esm'

import App from './App'

if (!window.IS_BERIAL_SANDBOX) {
  render(<App />, document.getElementById('app'))
}

register([
  {
    name: 'child-fre',
    url: 'https://berial-child-fre.vercel.app',
    path: ({ pathname }) => pathname !== '/react' && pathname !== '/vue'
  },
  {
    name: 'child-react',
    url: 'https://berial-child-react.vercel.app',
    path: ({ pathname }) => pathname === '/react'
  },
  {
    name: 'child-vue',
    url: 'https://berial-child-vue.vercel.app',
    path: ({ pathname }) => pathname === '/vue'
  }
])
