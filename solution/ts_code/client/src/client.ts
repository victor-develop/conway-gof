import { Vue } from 'vue/types/vue'
import GameState from './game-state'
import Player from '../../common/src/gamemodels/player'
import IPos from '../../common/src/gamemodels/ipos'


const eventType = {
  enter: 'enter',
  newPlayerIn: 'new-player-in',
  playerOut: 'player-out',
  gameStateUpdate: 'game-state-update',
}

const playerEventType = {
  putCellsAttemp: 'put-cells-attempt',
}

interface ClientApp {
  currentPlyaer: Player
  players: Player[]
  gameState: GameState
}

const messages = {

}

export default class Client {

  private eventBus: Vue
  private app: ClientApp

  private updateGameState(newState: GameState):void {
    if (newState.updateAt > this.app.gameState.updateAt) {
      this.app.gameState = newState
    }
  }

  private attemptPutCells(positions: IPos[]) {
    this.logger.transaction(this.attemptPutCells.name,(transactionLogger) => {
      transactionLogger.info({ positions }, 'data to be sent')
      this.gameApi
      .cells.patch(positions)
      .catch((err) => {
        transactionLogger.info(err, 'failed to put cells')
        this.noticer.notice(err.message)
      })
    })
  }

  constructor(eventBus: Vue) {
    this.eventBus = eventBus
  }

  public setup(): void {
    this.eventBus.$on(eventType.gameStateUpdate, this.updateGameState)
    this.eventBus.$on(playerEventType.putCellsAttemp, this.attemptPutCells)
  }
}
