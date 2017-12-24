import 'mocha'
import GameBoard from '../../../../common/src/gamemodels/game-board'
import { config } from '../../../src/config/config'
import createCell from '../../../../common/src/gamemodels/cell'
import { CellState } from '../../../../common/src/gamemodels/cell-state'
import { evolvePosition, DeadCell } from '../../../src/game-engine/evolution/evolution'
import * as assert from 'assert'
import ICell from '../../../../common/src/gamemodels/icell'
import { testSamples } from './data'

const assertTestSample = cellState => sampleBoards => sampleBoards.forEach((item) => {
  const result = evolvePosition(GameBoard.clone(item.board), item.cell)
  if (cellState instanceof DeadCell) {
    assert.equal(result, cellState)
  } else {
    assert.equal((<ICell>result).state, cellState)
  }
})

const assertAliveStillTestSample = assertTestSample(CellState.AliveStill)
const assertAliveFromDeathTestSample = assertTestSample(CellState.AliveFromDeath)
const assertDeathTestSample = assertTestSample(DeadCell.instance)


describe('evolvePosition() test', () => {

  describe('under-population: live cell with fewer than two live neighbors', () => {
    it('dies', (done) => {
      assertDeathTestSample(testSamples.zeroNeighborBoards)
      assertDeathTestSample(testSamples.oneNeighborsBoards)
      done()
    })
  })

  describe('live cell with two or three live neighbors', () => {
    it('lives on to next generation', (done) => {
      assertAliveStillTestSample(testSamples.twoNeighborsBoards)
      assertAliveStillTestSample(testSamples.threeNeighborsBoards)
      done()
    })
  })

  describe('live cell with more than three neighbors', () => {
    it('dies', (done) => {
      testSamples.multipleNeighborsBoards.forEach((pack) => {
        assertDeathTestSample(pack.boards)
      })
      done()
    })
  })

  describe('dead cell with just three neighbors', () => {
    it('gets alive again', (done) => {
      assertAliveFromDeathTestSample(testSamples.deadCellWithThreeNeighbors)
      done()
    })
  })

})
