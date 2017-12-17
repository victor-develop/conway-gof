import GameBoard from '../../../../common/src/gamemodels/game-board'
import ICell from '../../../../common/src/gamemodels/icell'
import IPos from '../../../../common/src/gamemodels/ipos'
import { CellState } from '../../../../common/src/gamemodels/cell-state'
import { Board } from '../../../../common/src/gamemodels/board'
import createCell from '../../../../common/src/gamemodels/cell'
import { Color } from '../../../../common/src/gamemodels/color'


interface EvolvingCellContext {
  board: GameBoard
  position: IPos
}

type surviveRule = (old: EvolvingCellContext) => boolean
type riseupRule = (old: EvolvingCellContext) => boolean

function getAvgColor(board: GameBoard, pos: IPos): Color {
  const neighborsColors = getNeighbors(board, pos).map(cell => tinycolor(cell.overlayColor).toRgb())
  const average = arr => arr.reduce((value1, value2) => value1 + value2, 0) / arr.length
  const r = average(neighborsColors.map(c => c.r))
  const g = average(neighborsColors.map(c => c.g))
  const b = average(neighborsColors.map(c => c.b))
  return tinycolor({ r, g, b }).toHex8String()
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

const underPopulation: surviveRule = context => getNeiborsCount(context) < minimum

const goodPopulation: surviveRule = (context: EvolvingCellContext) => {
  const countOfNeighbors = getNeiborsCount(context)
  return (countOfNeighbors >= minimum && countOfNeighbors <= maximum)
}

const overcrowding: surviveRule = context => getNeiborsCount(context) > maximum

const survives = (board: GameBoard) => (cell: ICell) => {
  const context = {
    board,
    position: cell,
  }
  return underPopulation(context) && goodPopulation(context) && overcrowding(context)
}

const reproduction: riseupRule = context => getNeiborsCount(context) === maximum

const willrise = (board: GameBoard) => (position: IPos) => reproduction({ board, position })


const deadCell = {}
const evolvePosition = (board: GameBoard, pos: IPos) => {

  if (board.isValidPos(pos)) {
    const cell = board.cells[pos.x][pos.y]

    if (survives(board)(cell)) {
      const newCell = Object.assign({}, cell, { state: CellState.AliveStill })
      return newCell
    }

  } else {

    if (willrise(board)(pos)) {
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

  const outputCells: ICell[] = []
  positions.forEach((pos) => {
    const cell = evolvePosition(board, pos)
    if (cell !== deadCell) {
      outputCells.push(<ICell>cell)
    }
  })

  return outputCells
}
