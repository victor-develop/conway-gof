import { presetPatterns } from '../../common/src/gamemodels/preset-pattern'
import { BoardBuilder } from '../../common/src/gamemodels/board'
import ILogger from '../../common/src/ilogger'
import TempLogger from '../../common/src/temp-logger'
import { Pattern } from '../../common/src/gamemodels/ipattern'

const mods = (<any>window).mods = (<any>window).mods || {}
const log = console.log
const tempLogger = new TempLogger('Client start')
const boardBuilder = new BoardBuilder(tempLogger)

const patternWidth = 10
const patternHeight = 10

mods.presetPatternBoards = presetPatterns
  .map(pattern =>
    boardBuilder.Create(patternWidth, patternHeight, pattern))

mods.boardBuilder = boardBuilder

