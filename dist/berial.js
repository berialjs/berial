(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.berial = {}));
}(this, (function (exports) { 'use strict';

  let apps = [];
  function register(tag, component, route) {
      class Berial extends HTMLElement {
          static get componentName() {
              return tag;
          }
          constructor() {
              super();
              for (const k in component) {
                  this[k] = component[k];
              }
          }
          connectedCallback() {
              this.attachShadow({
                  mode: 'open',
              });
              apps.push({
                  tag,
                  component,
                  route,
                  element: this,
              });
          }
      }
      const hasDef = window.customElements.get(tag);
      if (!hasDef) {
          customElements.define(tag, Berial);
      }
  }
  function start() {
      apps.forEach((app) => {
          const host = new Proxy(app.element, {
              get(target, key) {
                  return target[key];
              },
              set(target, key, val) {
                  target[key] = val;
                  process(app, host);
                  return true;
              },
          });
          process(app, host);
      });
  }
  function process(app, host) {
      const path = window.location.hash || window.location.pathname || '/';
      if (app.route === path) {
          ((window) => {
              app.component.mount(host);
          })(new Sandbox().proxy);
      }
      else {
          app.component.unmount(host);
      }
  }
  class Sandbox {
      constructor() {
          const raw = window;
          const fake = {};
          const proxy = new Proxy(fake, {
              get(target, key) {
                  console.log(target);
                  return target[key] || raw[key];
              },
              set(target, key, val) {
                  target[key] = val;
                  return true;
              },
          });
          this.proxy = proxy;
      }
  }
  window.addEventListener('hashchange', start);
  window.addEventListener('popstate', start);

  exports.Sandbox = Sandbox;
  exports.register = register;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=berial.js.map
