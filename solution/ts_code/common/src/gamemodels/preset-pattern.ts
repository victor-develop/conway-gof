import { Pattern } from './ipattern'
import { Board } from './board'
import GameBoard from './game-board'

/**
 *  refer to `https://en.wikipedia.org/wiki/Conway's_Game_of_Life#Examples_of_patterns`
 */

export const blinker: Pattern = [
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
]

export const toad: Pattern = [
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
]

export const tub: Pattern = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 2, y: 1 },
  { x: 1, y: 2 },
]

export const presetPatterns: Pattern[] = [blinker, toad, tub]


export function makeRandomPattern(board: GameBoard) {
  const subareaQty = 9
  const subareas = [...Array(subareaQty).keys()]
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min
  const randomIndex = () => random(0, subareaQty - 1)
  const areaWidth = board.width / subareaQty
  const areaX = randomIndex() * areaWidth
  const areaHeight = board.height / subareaQty
  const areaY = randomIndex() * areaHeight
  const areaPositions = board.allPositions().filter(pos =>
     pos.x >= areaX && pos.x <= (areaX + areaWidth) &&
     pos.y >= areaY && pos.y <= (areaY + areaHeight) &&
     (!board.isValidPos(pos)
  ))

  // randomly delete half of the elements
  // tslint:disable-next-line:no-magic-numbers
  for(let i = 0; i < areaPositions.length/2; i++) {
    const pickedIndex = Math.floor(Math.random() * areaPositions.length)
    areaPositions.splice(pickedIndex, 1)
  }
  return areaPositions
}

const patternBoardWidth = 10
const patternBoardHeight = 10
export const presetPatternBoards: Board[] = presetPatterns
  .map(pattern =>
    Board.create(patternBoardWidth, patternBoardHeight, pattern))
