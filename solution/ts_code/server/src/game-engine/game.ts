import { setInterval } from 'timers'
import { IEventBus } from '../../../common/src/ievent-bus'
import { evolveBoard } from './evolution/evolution'
import { IGameState, IPartialGameState_Evolution } from '../../../common/src/gamemodels/game-state'
import { apiEvents } from '../../../common/src/api/api-events';

class Game {
  evolveInterval
  private currentEvolutionToken: number
  state: IGameState
  eventBus: IEventBus

  runEvolution() {
    const updateToken = Date.now()
    this.currentEvolutionToken = updateToken
    const newBoard = evolveBoard(this.state.board)
    const newPartialState: IPartialGameState_Evolution = {
      updateAt: updateToken,
      board: newBoard,
    }
    this.state = Object.assign({}, this.state, newPartialState)
    this.eventBus.emit(apiEvents.gameStateUpdate, newPartialState)
  }
}
/*
function createGame(evolveIntervalSeconds: number): Game {
  const runEvolution = 
  setInterval(runEvolution)
}
*/

