import IGameState from './game-state'
import IPlayer from '../../common/src/gamemodels/IPlayer'
import IPos from '../../common/src/gamemodels/ipos'
import { Board } from '../../common/src/gamemodels/board'
import { ILogger } from '../../common/src/services'
import { IGameApi } from './gameapi/IGameApi'
import { INotice } from './inotice'
import { IEventBus } from './ievent-bus'
import { ClientState, InitialValue } from './client-state'
import { apiEvents } from '../../common/src/api/api-events'
import { playerEventType } from './event-types'
import IErrorResponse from '../../common/src/api/IErrorResponse'

const logMessage = {
  DATA_BE_SENT: 'data to be sent',
  FAIL_PUT_CELL: 'fail to put cells',
  GAME_NOT_INIT_YET: 'game is not initialized yet',
}

export class Client {
  private eventBus: IEventBus
  private state: ClientState
  private logger: ILogger
  private gameApi: IGameApi
  private noticer: INotice

  private init(): Promise<Client> {
    return this
    .setEvtListener()
    .then(() => this.gameApi.connect())
    .then(() => this)
  }

  private setEvtListener(): Promise<Client> {
    this.gameApi.on(apiEvents.IGameStateUpdate,
      (gameState: IGameState) => this.updateGameState(gameState))
    this.eventBus.on(playerEventType.putCellsAttempt,
      (positions: IPos[]) => this.attemptPatchCells(positions))

    return Promise.resolve(this)
  }

  private updateGameState(newState: IGameState): void {
    if (this.state.game instanceof InitialValue) {
      this.state.game = newState
      return
    }

    const oldState = (<IGameState>this.state.game)
    if (newState.updateAt > oldState.updateAt) {
      this.state.game = newState
    }
  }

  private attemptPatchCells(positions: IPos[]) {
    this.logger.child(this.attemptPatchCells.name)
    .then((transactionLogger) => {
      transactionLogger.info({ positions }, logMessage.DATA_BE_SENT)

      this.gameApi
        .cells.patch(positions)
        .catch((err: IErrorResponse) => {
          transactionLogger.err(err, logMessage.FAIL_PUT_CELL)
          this.noticer.notice(err.messages)
        })
    })
  }

  constructor(
    logger: ILogger,
    eventBus: IEventBus,
    state: ClientState,
    gameApi: IGameApi,
    noticer: INotice) {
    this.logger = logger
    this.eventBus = eventBus
    this.state = state
    this.gameApi = gameApi
    this.noticer = noticer
    this.init()
  }

  public get clientState(): ClientState {
    return this.state
  }

  public get clientEvent(): IEventBus {
    return this.eventBus
  }

  public static create =
    (logger: ILogger) =>
    (eventBus: IEventBus, state: ClientState,
      gameapi: IGameApi, noticer: INotice) =>
        new Client(logger, eventBus, state, gameapi, noticer)}
