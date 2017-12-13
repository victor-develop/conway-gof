import 'mocha'
import * as assert from 'assert'

describe('Server', () => {
  const successCode: number = 200
  it('should equals 1', (done) => {
    const a: number = 1
    assert.equal(a, 1)
    done()
  })
})
