import 'mocha'
import GameBoard from '../../../../common/src/gamemodels/game-board'
import { config } from '../../../src/config/config'
import createCell from '../../../../common/src/gamemodels/cell'
import { CellState } from '../../../../common/src/gamemodels/cell-state'
import { evolvePosition, DeadCell } from '../../../src/game-engine/evolution/evolution'
import * as assert from 'assert'
import ICell from '../../../../common/src/gamemodels/icell'
import { testSamples } from './data'

const cell = (x: number, y:number) =>
  createCell(x, y, 'doesntmatter', CellState.AliveStill, '#ffffff')

const makeTestBoard = (cells: ICell[]) => GameBoard.create(
  config.game.boardWidth, config.game.boardHeight, cells)

describe('evolvePosition() test', () => {

  const assertDeath = (board: GameBoard, aCell: ICell) => {
    const result = evolvePosition(board, aCell)
    assert.equal(result, DeadCell.instance)
  }

  describe('under-population: live cell with fewer than two live neighbors', () => {
    it('dies', (done) => {
      testSamples.oneNeighborsBoards.forEach((item) => {
        assertDeath(GameBoard.clone(item.board), item.cell)
      })
      done()
    })
  })

  describe('live cell with two or three live neighbors', () => {
    it('lives on to next generation')
  })

  describe('live cell with more than three neighbors', () => {
    it('dies')
  })

  describe('dead cell with just three neighbors', () => {
    it('gets alive again')

    it('has an average color of its three neighbors')
  })

  describe('test with a few patterns', () => {
    it('should have correct evolution')
  })
})
