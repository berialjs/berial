import { h, render } from 'fre'

function App() {
  return <div>
    <h1 style={{ color: 'rgb(242, 35, 101)' }}>Hello Fre!!</h1>
    <img height='300' src='http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg' />
  </div>
}

if (!window.IS_BERIAL_SANDBOX) {
  render(<App />, document.getElementById('root'))
}

export async function bootstrap() {
  console.log('fre bootstrap')
}

export async function mount({ host }) {
  console.log('fre mount')
  render(<App />, host.shadowRoot.getElementById('root'))
}

export async function unmount({ host }) {
  console.log('fre unmout')
  const root = host.shadowRoot.getElementById('root')
  root.innerHTML = ''
}
