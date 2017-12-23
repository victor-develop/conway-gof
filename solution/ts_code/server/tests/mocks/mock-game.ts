import { ILogger } from '../../../common/src/services'
import { Game } from '../../src/game-engine/game'
import { evolveBoard } from '../../src/game-engine/evolution/evolution'
import { makeRandomPattern } from '../../../common/src/gamemodels/preset-pattern'
import { config } from '../../src/config/config'
import { createEventBus } from '../../../client/src/event-bus'
import { IEventBus } from '../../../common/src/ievent-bus'
import { IIntervalLoopSetter, IIntervalLoop } from '../../src/game-engine/i-interval-loop'


export type manualIntervalLoopSetter = (eventBus: IEventBus) => IIntervalLoopSetter

/**
 * This generates a faked loop, the operation will only loop once 
 * when 'tick' event is fired.
 * 
 * @param eventBus - used to control the loop
 */
export const manualIntervalLoop = (eventBus: IEventBus) => (operation, milleSeconds) => {
  const start = () => { return }
  const stop = () => { return }

  eventBus.on('tick', () => {
    operation()
  })

  const loopSetter: IIntervalLoop = {
    start,
    stop,
  }
  return loopSetter
}


/**
 * This creates a mocked game where you can manually
 * constrol when it evolves and consumes the job queue for updating the gameboard
 * @param logger 
 * @param evolveControl - eventbus listening to each 'tick' event, and then evolve the gameboard
 * @param jobQueueLoopControl - eventbus listening to each 'tick' event,
 *                              and then consume the job queue
 */
export function mockGame(
  logger: ILogger,
  evolveControl: IEventBus,
  jobQueueLoopControl: IEventBus) {

  const game = new Game(
        logger, evolveBoard, makeRandomPattern,
        config.game.evolveInterval, createEventBus(logger),
        manualIntervalLoop(evolveControl),
        manualIntervalLoop(jobQueueLoopControl))
  return game
}

export interface IMockGameToolset {
  game: Game,
  evolveEvent: IEventBus,
  jobQueueEvent: IEventBus
}

export function mockGameToolset(logger: ILogger) {
  const evolveEvent = createEventBus(logger)
  const jobQueueEvent = createEventBus(logger)
  const game = mockGame(logger, evolveEvent, jobQueueEvent)
  return {
    game,
    evolveEvent,
    jobQueueEvent,
  }
}
