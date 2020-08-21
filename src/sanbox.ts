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

      const console = {}

      ;(function mockConsole(console: any) {
        const keys = [
          'debug',
          'error',
          'info',
          'log',
          'warn',
          'dir',
          'dirxml',
          'table',
          'trace',
          'group',
          'groupCollapsed',
          'groupEnd',
          'clear',
          'count',
          'countReset',
          'assert',
          'profile',
          'profileEnd',
          'time',
          'timeLog',
          'timeEnd',
          'timeStamp'
        ]

        for (const k of keys) {
          console[k] = function () {
            if (arguments.length > 1 && typeof arguments[0] === 'string') {
              arguments[0] = arguments[0].replace(/%/g, '%%')
            }
            return console[k](...arguments)
          }
        }
      })(console)

      let allowList = {
        __proto__: null,
        console,
        String,
        Number,
        Array,
        Symbol,
        Math,
        document,
        Object,
        Promise,
        RegExp,
        eval: function (code: string) {
          return run('return ' + code, null)
        },
        alert: function () {
          alert('Sandboxed alert:' + arguments[0])
        },
        ...options.allowList
      }
      if (!Object.isFrozen(String.prototype)) {
        Object.freeze(Object)
        Object.freeze(String)
        Object.freeze(Number)
        Object.freeze(Array)
        Object.freeze(Symbol)
        Object.freeze(Math)
        Object.freeze(Function)
        Object.freeze(RegExp)
        Object.freeze(BigInt)
        Object.freeze(Promise)
        Object.freeze(console)
        Object.freeze(BigInt.prototype)
        Object.freeze(Object.prototype)
        Object.freeze(String.prototype)
        Object.freeze(Number.prototype)
        Object.freeze(Array.prototype)
        Object.freeze(Symbol.prototype)
        Object.freeze(Function.prototype)
        Object.freeze(RegExp.prototype)
        Object.freeze(Promise.prototype)
        Object.defineProperty(
          async function () {}.constructor.prototype,
          'constructor',
          {
            value: null,
            configurable: false,
            writable: false
          }
        )
        Object.defineProperty(
          async function* () {}.constructor.prototype,
          'constructor',
          {
            value: null,
            configurable: false,
            writable: false
          }
        )
        Object.defineProperty(
          function* () {}.constructor.prototype,
          'constructor',
          {
            value: null,
            configurable: false,
            writable: false
          }
        )
      }
      let proxy = new Proxy(allowList, handler)
      let catchAllProxy = new Proxy(
        {
          __proto__: null,
          proxy: proxy,
          globalThis: new Proxy(allowList, handler),
          window: new Proxy(allowList, handler)
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
