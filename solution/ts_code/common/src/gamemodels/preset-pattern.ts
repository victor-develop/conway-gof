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

// TODO: make a real random generator
export function makeRandomPattern(boad: GameBoard) {
  return presetPatterns[1].filter(pos => (!boad.isValidPos(pos)))
}

const patternBoardWidth = 10
const patternBoardHeight = 10
export const presetPatternBoards: Board[] = presetPatterns
  .map(pattern =>
    Board.create(patternBoardWidth, patternBoardHeight, pattern))
