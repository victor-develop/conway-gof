import { presets } from '../../common/src/gamemodels/preset-pattern'
import { BoardBuilder } from '../../common/src/gamemodels/board'
import ILogger from '../../common/src/ilogger'

const mods = (<any>window).mods = (<any>window).mods || {}
const tempLogger: ILogger = { info: console.log }
const boardBuilder = new BoardBuilder(tempLogger)

mods.presetPatterns = presets
mods.boardBuilder = boardBuilder

