import { expect } from 'chai'
import { spy } from 'sinon'
import { run } from '@/sandbox'

describe('sandbox', () => {
  it('should throw error when code has dynamic import', () => {
    let err = null
    try {
      run(`import('slip inside the eye of your mind')`, {})
    } catch (e) {
      err = e
    }
    expect(err?.message).to.eq('Dynamic imports are blocked')
  })
  it('should not leak variable on window', () => {
    run('window.a = 1')
    expect(!Reflect.has(window, 'a')).to.eq(true)
  })
  it('should not affect window in different run', () => {
    const window1Spy = spy()
    const window2Spy = spy()
    run(`window.a = 1; console.log(window.a)`, {
      allowList: {
        console: {
          log: window1Spy
        }
      }
    })
    run(`window.a = 2; console.log(window.a)`, {
      allowList: {
        console: {
          log: window2Spy
        }
      }
    })
    expect(window1Spy.calledWith(1)).to.eq(true)
    expect(window2Spy.calledWith(2)).to.eq(true)
  })
})
