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
  const board = Board.create(testLogger)(width, height, positions)
  it('will return a new Board instance', (done) => {
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
