(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.berial = {}));
}(this, (function (exports) { 'use strict';

  const LOAD = 0;

  let apps = [];

  function define(view, route) {
    apps.push({
      view,
      route,
      status: LOAD,
    });
    return invoke()
  }

  function invoke() {
      const hash = window.location.hash;

    let ps = apps.map(shouldLoad).filter(item=>item.route === hash);
    console.log(ps);
    return Promise.all(ps)
      .then(() => {
        return apps
      })
      .catch((e) => {
        console.log(e);
      })
  }

  function shouldLoad(app) {
    let p = app.view({});
    return p
      .then((module) => {
        app.render = queueJob(module.render);
        return app
      })
      .catch((e) => {
        console.log(e);
        return app
      })
  }

  function queueJob(queue) {
    return (props) => {
      return new Promise((resolve, reject) => {
        wait(0);
        function wait(i) {
          const fn = queue[i](props);
          fn.then(() => {
            if (i === queue.length - 1) {
              resolve();
            } else {
              wait(i++);
            }
          }).catch((e) => reject(e));
        }
      })
    }
  }

  function reroute() {
      
    }


  window.addEventListener('hashchange', reroute);
  window.addEventListener('popstate', reroute);

  exports.define = define;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=berial.js.map
