import 'mocha'
import * as assert from 'assert'
import { Board } from '../../../common/src/gamemodels/board'
import TempLogger from '../../../common/src/temp-logger'
import { presets } from '../../../common/src/gamemodels/preset-pattern';

const testLogger = new TempLogger('Board test')

describe('Board class', () => {
  const width = 10
  const height = 10
  const positions = presets[0]
  it('create() will return a new Board instance', (done) => {
    const board = Board.create(testLogger)(width, height, positions)
    assert.ok(board)
    done()
  })
})
