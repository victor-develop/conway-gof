import IPlayer from '../../common/src/gamemodels/iplayer'
import IPos from '../../common/src/gamemodels/ipos'
import { Board } from '../../common/src/gamemodels/board'
import { ILogger } from '../../common/src/services'
import { IGameApi } from './gameapi/IGameApi'
import { INotice } from './inotice'
import { IEventBus } from '../../common/src/ievent-bus'
import { ClientState, InitialValue, ClientContext } from './client-state'
import { apiEvents } from '../../common/src/api/api-events'
import { playerEventType } from './event-types'
import IErrorResponse from '../../common/src/api/IErrorResponse'
import { IGameState } from '../../common/src/gamemodels/i-game-state'
import { IPlayerProfile } from '../../common/src/api/i-player-profile'
import { socketEvents } from '../../common/src/api/socket-events'
import { error } from 'util'

const logMessage = {
  DATA_BE_SENT: 'data to be sent',
  FAIL_PUT_CELL: 'fail to put cells',
  GAME_NOT_INIT_YET: 'game is not initialized yet',
  BELATED_STATE_RECEIVED: 'a overdue IGameState update is received',
}

export class Client {
  private eventBus: IEventBus
  private state: ClientState
  private logger: ILogger
  private gameApi: IGameApi
  private noticer: INotice

  private setEvtListener(): Promise<Client> {
    this.gameApi.on(apiEvents.context, context => this.updateContext(context))
    this.gameApi.on(apiEvents.gameStateUpdate,
      (gameState: IGameState) => this.updateGameState(gameState))
    this.gameApi.on(socketEvents.connect_error, (err) => {
      (<any>this.state).errors.push({
        message: 'Server disconnected, you better refresh',
        notified: false,
      })
    })
    this.eventBus.on(playerEventType.putCellsAttempt,
      (positions: IPos[]) => this.attemptPatchCells(positions))
    this.eventBus.on(playerEventType.submitProfile,
      (profile: IPlayerProfile) => this.gameApi.currentPlayer.submitProfile(profile))
    return Promise.resolve(this)
  }

  // TODO: think a bit more on error handling
  private updateContext(context: ClientContext) {
    this.state.context = Object.assign(this.state.context, context)
  }

  private updateGameState(newState: IGameState): void {
    if (this.state.game instanceof InitialValue) {
      this.state.game = newState
      return
    }

    const oldState = (<IGameState>this.state.game)
    if (newState.updateAt >= oldState.updateAt) {
      this.state.game = Object.assign(this.state.game, newState)
    } else {
      this.logger.info({ oldState, newState }, logMessage.BELATED_STATE_RECEIVED)
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

  public init(): Promise<Client> {
    return this
    .setEvtListener()
    .then(() => this.gameApi.connect())
    .then(() => this)
  }

  protected constructor(
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
  }

  public get clientState(): ClientState {
    return this.state
  }

  public get clientEvent(): IEventBus {
    return this.eventBus
  }

  public static eventTypes = {
    INIT_READY: 'init-ready',
  }

  public static create =
    (logger: ILogger) =>
    (eventBus: IEventBus, state: ClientState,
      gameapi: IGameApi, noticer: INotice) =>
       new Client(logger, eventBus, state, gameapi, noticer).init()
}
