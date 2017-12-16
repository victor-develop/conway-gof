import 'mocha'
import * as assert from 'assert'
import { EventEmitter } from 'eventemitter3'
import { createEventBus } from '../src/event-bus'

/**
 * Why am I testing a 3rd party lib? Just see if I use it correctly, serves like sample code
 */
describe('EventBus events will be bound and emitted correctly', () => {
  it('should fire hello event', (done) => {
    const bus = createEventBus()
    const hello = 'hello'
    let fired = false
    bus.on(hello, () => {
      fired = true
    })
    bus.emit(hello)
    assert.equal(fired, true)
    done()
  })
})
