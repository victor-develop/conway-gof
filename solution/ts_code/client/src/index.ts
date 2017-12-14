import { presets } from '../../common/src/gamemodels/preset-pattern'
import { BoardBuilder } from '../../common/src/gamemodels/board'
import ILogger from '../../common/src/ilogger'
import TempLogger from '../../common/src/temp-logger'

const mods = (<any>window).mods = (<any>window).mods || {}
const log = console.log
const tempLogger = new TempLogger()
const boardBuilder = new BoardBuilder(tempLogger)

mods.presetPatterns = presets
mods.boardBuilder = boardBuilder

