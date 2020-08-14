import Vue from 'vue'
import App from './App.vue'

let mountEl = null

if (!window.IS_BERIAL_SANDBOX) {

  const appNode = document
    .querySelector('#root')
    .appendChild(document.createElement('div'))

  new Vue({
    el: appNode,
    render: h => h(App)
  })
}

export async function bootstrap() {
  console.log('child-vue bootstrap')
}

export async function mount({ host }) {
  console.log('child-vue mount')

  const appNode = host.shadowRoot
    .getElementById('root')
    .appendChild(document.createElement('div'))

  mountEl = new Vue({
    el: appNode,
    render: h => h(App)
  })
}

export async function unmount({ host }) {
  console.log('child-vue unmout')

  mountEl.$destroy()
  const root = host.shadowRoot.getElementById('root')
  root.innerHTML = ''
}
