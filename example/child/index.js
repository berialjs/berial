import { h, render } from 'fre'

function App() {
  return <div>hello fre!</div>
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

export async function unmount() {
  console.log('unmount')
}
