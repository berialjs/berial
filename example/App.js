import { h, useEffect } from 'fre'
import { register } from '../dist/berial.esm'


function App() {

  const changeRoute = (pathname) => {
    history.pushState({}, '', pathname)
  }

  return <div>
    <header className='header'>
      <button onClick={() => changeRoute('/')} >Fre</button>
      <button onClick={() => changeRoute('/react')} >React</button>
      <button onClick={() => changeRoute('/vue')} >Vue</button>
    </header>
    <child-fre></child-fre>
    <child-react></child-react>
    <child-vue></child-vue>
  </div>
}

export default App
