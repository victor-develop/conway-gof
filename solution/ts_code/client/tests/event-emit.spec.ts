import 'mocha'
import * as assert from 'assert'
import * as EventEmitter from 'eventemitter3'

/**
 * Why am I testing a 3rd party lib? Just see if I use it correctly, serves like sample code
 */
describe('EventBus events will be bound and emitted correctly', () => {
  it('should fire hello event', (done) => {
    const bus = new EventEmitter.EventEmitter()
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
