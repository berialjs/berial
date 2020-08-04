import React from 'react'
import ReactDOM from 'react-dom'
import { register, start } from '../../../dist/berial'

register(
  'two-app',
  'http://localhost:3002/index.html',
  (location) => location.pathname === '/'
)

start()

function App() {
  return 111
}
ReactDOM.render(<App />, document.getElementById('root'))