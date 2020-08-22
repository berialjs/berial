import * as chai from 'chai'
import { run } from '../sandbox'

const expect = chai.expect

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
})
