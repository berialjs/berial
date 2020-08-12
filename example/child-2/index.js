import { h, render } from 'fre'

function App() {
  return <div>hello fre app - 2!</div>
}

if (!window.IS_BERIAL_SANDBOX) {
  render(<App />, document.getElementById('root'))
}

export async function bootstrap() {
  console.log('bootstrap')
}

export async function mount({ host }) {
  console.log('mount')
  render(<App />, host.shadowRoot.getElementById('root'))
}

export async function unmount({ host }) {
  console.log('unmout', host)
  const root = host.shadowRoot.getElementById('root')
  root.removeChild(root.firstChild)
}
