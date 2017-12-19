/**
 * functions for constructing widely used objects that requires complex dependency injection
 */
import { Game } from './game-engine/game'
import { ILogger } from '../../common/src/services'
import { evolveBoard } from './game-engine/evolution/evolution'
import { makeRandomPattern } from '../../common/src/gamemodels/preset-pattern'
import { config } from './config/config'
import { EventEmitter } from 'eventemitter3'
import { logEventBus } from '../../common/src/attach-logger'

/**
 * resolve dependecies and create a game instance
 */
export function createGame(logger: ILogger): Game {
  const game = new Game(
    logger,
    evolveBoard,
    makeRandomPattern,
    config.game.evolveInterval,
    logEventBus(logger, new EventEmitter()))
  return game
}
