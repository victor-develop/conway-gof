import 'mocha'
import * as assert from 'assert'
import { Board } from '../../../common/src/gamemodels/board'
import TempLogger from '../../../common/src/temp-logger'
import { presets } from '../../../common/src/gamemodels/preset-pattern';

const testLogger = new TempLogger('Board test')

describe('Board.create method', () => {
  const width = 10
  const height = 10
  const positions = presets[0]
  describe('create() a normal board', () => {
    const board = Board.create(testLogger)(width, height, positions)
    it('will have a new Board instance', (done) => {
      assert.ok(board)
      done()
    })
    it('has correct height and width', (done) => {
      assert.equal(board.width, width)
      assert.equal(board.height, height)
      done()
    })
    it('has a correct hash cell structure', (done) => {
      assert.deepEqual(board.cells, {
        0: { 1: { x: 0, y: 1 } },
        1: { 1: { x: 1, y: 1 } },
        2: { 1: { x: 2, y: 1 } },
      })
      done()
    })
  })

  describe('creat() with unexpected width and height', () => {
    it('shoud reject negative width or height', (done) => {
      const create = Board.create
      const minusWidth = -10
      const minusHeight = -10
      asserRangeError(() => {
        create(minusWidth, height, positions)
      })
      asserRangeError(() => {
        create(width, minusHeight, positions)
      })
      asserRangeError(() => {
        create(minusWidth, minusHeight, positions)
      })
      done()
    })
  })
})

/**
 * Assert a rangeError will be thrown while executing callback 
 * Only syncronous callback code supported, async code will not work
 * @param callback 
 */
function asserRangeError(callback) {
  assert.throws(() => {
    callback()
  },
    RangeError,
  )
}
