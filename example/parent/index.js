import { register, start } from '../../dist/berial'
import { h, render } from 'fre'

function App() {

  const changeRoute = (pathname) => {
    history.pushState({}, '', pathname)
  }

  return <div>
    <header>
      <button onClick={() => changeRoute('/')} >Child-1</button>&nbsp;
      <button onClick={() => changeRoute('/two')} >Child-2</button>
    </header>
    <one-app></one-app>
    <two-app></two-app>
  </div>
}

render(<App />, document.getElementById('app'))

register(
  'one-app',
  'http://localhost:3001',
  (location) => location.pathname === '/'
)

register(
  'two-app',
  'http://localhost:3002',
  (location) => location.pathname === '/two'
)
start()
