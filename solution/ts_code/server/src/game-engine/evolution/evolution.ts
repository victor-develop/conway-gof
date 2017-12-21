import GameBoard from '../../../../common/src/gamemodels/game-board'
import ICell from '../../../../common/src/gamemodels/icell'
import IPos from '../../../../common/src/gamemodels/ipos'
import { CellState } from '../../../../common/src/gamemodels/cell-state'
import { Board } from '../../../../common/src/gamemodels/board'
import createCell from '../../../../common/src/gamemodels/cell'
import { Color } from '../../../../common/src/gamemodels/color'
import * as tinycolor from 'tinycolor2'
import { ColorUtil } from '../color-util'

interface EvolvingCellContext {
  board: GameBoard
  position: IPos
}

type livingCondition = (old: EvolvingCellContext) => boolean
type riseupCondition = (old: EvolvingCellContext) => boolean

// TODO: move some logic to colo util
function getAvgColor(board: GameBoard, pos: IPos): Color {
  const neighborsColors = getNeighbors(board, pos).map(cell => (cell.overlayColor))
  return ColorUtil.getAverage(neighborsColors)
}

function getNeiborPositions(c: IPos): IPos[] {
  return [
    // upward row
    { x: c.x - 1, y: c.y - 1 },
    { x: c.x - 0, y: c.y - 1 },
    { x: c.x + 1, y: c.y - 1 },
    // same row without itself
    { x: c.x - 1, y: c.y - 0 },
    { x: c.x + 1, y: c.y - 0 },
    // downward row
    { x: c.x - 1, y: c.y + 1 },
    { x: c.x - 0, y: c.y + 1 },
    { x: c.x + 1, y: c.y + 1 },
  ]
}

const getNeighbors = (board: GameBoard, position: IPos) =>
  getNeiborPositions(position)
  .filter(pos => board.isValidPos(pos))
  .map(pos => <ICell>board.cells[pos.x][pos.y])

const getNeiborsCount = (context: EvolvingCellContext) =>
  getNeighbors(context.board, context.position).length


const minimum = 2
const maximum = 3

const underPopulation: livingCondition = context => getNeiborsCount(context) < minimum

const goodPopulation: livingCondition = (context: EvolvingCellContext) => {
  const countOfNeighbors = getNeiborsCount(context)
  return (countOfNeighbors >= minimum && countOfNeighbors <= maximum)
}

const overcrowding: livingCondition = context => getNeiborsCount(context) > maximum

const survives = (board: GameBoard, cell: ICell) => {
  const context = {
    board,
    position: cell,
  }
  if (goodPopulation(context)){
    return true
  }
  return false
}

const willrise: riseupCondition = context => getNeiborsCount(context) === maximum

const deadCell = {}
const evolvePosition = (board: GameBoard, pos: IPos) => {

  if (board.isValidPos(pos)) {
    const cell = board.cells[pos.x][pos.y]

    if (survives(board, cell)) {
      const newCell = Object.assign({}, cell, { state: CellState.AliveStill })
      return newCell
    }

  } else {

    if (willrise({ board, position: pos })) {
      return createCell(pos.x, pos.y, '', CellState.AliveFromDeath, getAvgColor(board, pos))
    }
  }

  return deadCell
}

export const evolveBoard = (board: GameBoard) => {
  const xs = [...Array(board.width).keys()]
  const ys = [...Array(board.height).keys()]
  // tslint:disable-next-line:ter-arrow-parens
  const positions = xs.map(x => ys.map(y => { return { x, y } }))
  .reduce((posList, pos) => posList.concat(pos, []))

  const newBoard = GameBoard.create(board.width, board.height, [])
  positions.forEach((pos) => {
    const cell = evolvePosition(board, pos)
    if (cell !== deadCell) {
      newBoard.addCell(<ICell>cell)
    }
  })

  return newBoard
}
