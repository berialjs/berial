import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

if (!window.IS_BERIAL_SANDBOX) {
  ReactDOM.render(<App />, document.getElementById('root'))
}

export async function bootstrap() {
  console.log('react bootstrap')
}

export async function mount({ host }) {
  console.log('react mount')

  ReactDOM.render(<App />, host.getElementById('root'))
}

export async function unmount({ host }) {
  console.log('react unmout')

  const root = host.getElementById('root')
  ReactDOM.unmountComponentAtNode(root)
}
