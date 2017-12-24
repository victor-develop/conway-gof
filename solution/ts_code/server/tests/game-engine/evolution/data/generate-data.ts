/**
 *  This script is used to generate static test data
 *  Usually it will not be executed unless you want to regenearate it
 */

import { CellState } from '../../../../../common/src/gamemodels/cell-state'
import * as fs from 'fs'
import { getNeiborPositions } from '../../../../src/game-engine/evolution/evolution'
import ICell from '../../../../../common/src/gamemodels/icell'
import * as pickRandom from 'pick-random'
import GameBoard from '../../../../../common/src/gamemodels/game-board'
import { config } from '../../../../src/config/config'
import { TempLogger } from '../../../../../common/src/services'
import createCell from '../../../../../common/src/gamemodels/cell'
import { cellsPath } from './settings'

export const cell = (x: number, y:number) =>
createCell(x, y, 'doesntmatter', CellState.AliveStill, '#ffffff')

function generateCells(): ICell[] {
  const length = 10
  const xs = [...Array(length).keys()]
  const ys = [...Array(length).keys()]
  return xs.map(x => ys.map(y => cell(x, y)))
.reduce((posList, pos) => posList.concat(pos, []))
}

const cells = generateCells()


fs.writeFileSync(cellsPath, JSON.stringify(cells))

const logger = new TempLogger('generate boards with neighbors for cells')

function generateNeighborsBoard(aCell: ICell, count: number, includeSelf: boolean = true) {
  const neighborPositions = getNeiborPositions(aCell).filter(pos => pos.x>=0 && pos.y >=0)

  if (neighborPositions.length < count) {
    return null
  }

  const someNeighbors = pickRandom(neighborPositions, { count })
    .map(pos => cell(pos.x, pos.y))

  let pattern
  if (includeSelf) {
    pattern = [aCell].concat(someNeighbors)
  } else {
    pattern = someNeighbors
  }

  const board = GameBoard.create(
    config.game.boardWidth,
    config.game.boardHeight,
    pattern)

  return {
    cell: aCell,
    board,
  }
}

const makeNeighborsBoards = (neighborsCount: number) =>
  cells.map(c => generateNeighborsBoard(c, neighborsCount)).filter(board => board != null)

const zeroNeighborBoards = cells.map((c) => {
  const pack = {
    cell: c,
    board: GameBoard.create(config.game.boardWidth, config.game.boardHeight, [c]),
  }
  return pack
})

const oneNeighborsBoards = makeNeighborsBoards(1)
// tslint:disable-next-line:no-magic-numbers
const twoNeighborsBoards = makeNeighborsBoards(2)
// tslint:disable-next-line:no-magic-numbers
const threeNeighborsBoards = makeNeighborsBoards(3)
// tslint:disable-next-line:no-magic-numbers
const multipleNeighborsBoards = [4, 5, 6, 7, 8]
  .map((count) => {
    const pack = {
      neighborsCount: count,
      boards: makeNeighborsBoards(count),
    }
    return pack
  })
const deadCellWithThreeNeighbors = cells
  // tslint:disable-next-line:no-magic-numbers
  .map(c => generateNeighborsBoard(c, 3, false))
  .filter(board => board != null)

const writeFileCallback = (path: string) => (err) => {
  if (err) {
    throw err
  }
  logger.info(`${path} saved.`)
}

const writeFile = (path: string, obj: any) =>
  // tslint:disable-next-line:no-magic-numbers
  fs.writeFile(path, JSON.stringify(obj, null, 2), writeFileCallback(path))

const zeroNeighborBoardsPath = './zero-neighbor-boards.json'
writeFile(zeroNeighborBoardsPath, zeroNeighborBoards)

const oneNeighborsBoardsPath = './one-neighbor-boards.json'
writeFile(oneNeighborsBoardsPath, oneNeighborsBoards)

const twoNeighborsBoardsPath = './two-neighbors-boards.json'
writeFile(twoNeighborsBoardsPath, twoNeighborsBoards)

const threeNeighborsBoardsPath = './three-neighbors-boards.json'
writeFile(threeNeighborsBoardsPath, threeNeighborsBoards)

const multipleNeighborsBoardsPath = './multiple-neighbors-boards.json'
writeFile(multipleNeighborsBoardsPath, multipleNeighborsBoards)

const deadCellWithThreeNeighborsPath = './dead-three-neighbors-boards.json'
writeFile(deadCellWithThreeNeighborsPath, deadCellWithThreeNeighbors)

