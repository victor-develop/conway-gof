import 'mocha'
import * as assert from 'assert'
import EventBus from '../src/event-bus'

describe('EventBus events will be bound and emitted correctly', () => {
  it('should fire hello event', (done) => {
    const bus = new EventBus()
    const hello = 'hello'
    let fired = false
    bus.$on(hello, () => {
      fired = true
    })
    bus.$emit(hello)
    assert.equal(fired, true)
    done()
  })
})
