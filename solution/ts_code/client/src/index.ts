import { presetPatterns } from '../../common/src/gamemodels/preset-pattern'
import { BoardBuilder, Board } from '../../common/src/gamemodels/board'
import ILogger from '../../common/src/ilogger'
import TempLogger from '../../common/src/temp-logger'
import { Pattern } from '../../common/src/gamemodels/ipattern'

const mods = (<any>window).mods = (<any>window).mods || {}
const log = console.log
const tempLogger = new TempLogger('Client start')

const patternWidth = 10
const patternHeight = 10

mods.presetPatternBoards = presetPatterns
  .map(pattern =>
    Board.create(patternWidth, patternHeight, pattern))

mods.Board = Board
