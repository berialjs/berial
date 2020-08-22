import { ProxyType, Lifecycle } from './types'

export function run(code: string, options: any) {
  try {
    if (checkSyntax(code)) {
      let handler = {
        get(obj: any, prop: string) {
          return Reflect.has(obj, prop) ? obj[prop] : null
        },
        set(obj: any, prop: string, value: any) {
          Reflect.set(obj, prop, value)
          return true
        },
        has(obj: any, prop: string) {
          return obj && Reflect.has(obj, prop)
        }
      }
      let catchAllHandler = {
        get(obj: any, prop: string) {
          return Reflect.get(obj, prop)
        },
        set() {
          return true
        },
        has() {
          return true
        }
      }

      let allowList = {
        IS_BERIAL_SANDBOX: true,
        __proto__: null,
        console,
        String,
        Number,
        Array,
        Symbol,
        Math,
        Object,
        Promise,
        RegExp,
        JSON,
        Date,
        Function,
        parseInt,
        document,
        navigator,
        location,
        performance,
        MessageChannel,
        SVGElement,
        HTMLIFrameElement,
        HTMLElement,
        history,
        Map,
        Set,
        WeakMap,
        WeakSet,
        Error,
        localStorage,
        decodeURI,
        encodeURI,
        setTimeout: setTimeout.bind(window),
        clearTimeout: clearTimeout.bind(window),
        setInterval: setInterval.bind(window),
        clearInterval: clearInterval.bind(window),
        requestAnimationFrame: requestAnimationFrame.bind(window),
        cancelAnimationFrame: cancelAnimationFrame.bind(window),
        addEventListener: addEventListener.bind(window),
        removeEventListener: removeEventListener.bind(window),
        eval: function (code: string) {
          return run('return ' + code, null)
        },
        alert: function () {
          alert('Sandboxed alert:' + arguments[0])
        },
        ...(options.allowList || {})
      }
      let proxy = new Proxy(allowList, handler)
      let catchAllProxy = new Proxy(
        {
          __proto__: null,
          proxy: proxy,
          globalThis: new Proxy(allowList, handler),
          window: new Proxy(allowList, handler),
          self: new Proxy(allowList, handler)
        },
        catchAllHandler
      )
      let output = Function(
        'proxy',
        'catchAllProxy',
        `with(catchAllProxy) {     
            with(proxy) {  
              return (function(){                                               
                "use strict";
                ${code};
                return window
              })();
            }
        }`
      )(proxy, catchAllProxy)
      return output
    }
  } catch (e) {
    throw e
  }
}
function checkSyntax(code: string) {
  Function(code)
  if (/\bimport\s*(?:[(]|\/[*]|\/\/|<!--|-->)/.test(code)) {
    throw new Error('Dynamic imports are blocked')
  }
  return true
}
