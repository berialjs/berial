const LOAD = 0

let apps = []

export function define(view, route) {
  apps.push({
    view,
    route,
    status: LOAD,
  })
  return invoke()
}

function invoke() {
    const hash = window.location.hash

  let ps = apps.map(shouldLoad).filter(item=>item.route === hash)
  console.log(ps)
  return Promise.all(ps)
    .then(() => {
      return apps
    })
    .catch((e) => {
      console.log(e)
    })
}

function shouldLoad(app) {
  let p = app.view({})
  return p
    .then((module) => {
      app.render = queueJob(module.render)
      return app
    })
    .catch((e) => {
      console.log(e)
      return app
    })
}

function queueJob(queue) {
  return (props) => {
    return new Promise((resolve, reject) => {
      wait(0)
      function wait(i) {
        const fn = queue[i](props)
        fn.then(() => {
          if (i === queue.length - 1) {
            resolve()
          } else {
            wait(i++)
          }
        }).catch((e) => reject(e))
      }
    })
  }
}

function reroute() {
    
  }


window.addEventListener('hashchange', reroute);
window.addEventListener('popstate', reroute);
