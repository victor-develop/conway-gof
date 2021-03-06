import { IGameApi } from './IGameApi'
import IResponse from '../../../common/src/api/IResponse'
import * as socketIo from 'socket.io-client'
import { config } from '../../../server/src/config/config'
import { socketEvents } from '../../../common/src/api/socket-events'
import IPos from '../../../common/src/gamemodels/ipos'
import { ILogger } from '../../../common/src/services'
import { apiEvents } from '../../../common/src/api/api-events'
import { EventEmitter } from 'eventemitter3'
import TempLogger from '../../../common/src/temp-logger'
import { IEventBus } from '../../../common/src/ievent-bus'
import { createEventBus } from '../../../common/src/create-event-bus'
import { Board } from '../../../common/src/gamemodels/board'
import { IPlayerProfile } from '../../../common/src/api/i-player-profile'
import { IGameState } from '../../../common/src/gamemodels/i-game-state'
import GameBoard from '../../../common/src/gamemodels/game-board'
import IPlayerContext from '../../../common/src/gamemodels/iplayer-context';
import { ClientContext } from '../client-state';
import IErrorResponse from '../../../common/src/api/IErrorResponse';


const errorMessages = {
  CONNECT_BEFORE_PATCH: 'call connect() first in order to patch()',
  CONNECT_BEFORE_EMIT: 'call connect() first before emitting events',
}


export class GameApi implements IGameApi {
  private socket: SocketIOClient.Socket
  private socketOnReady: ((socket: SocketIOClient.Socket) => void)[]
  private logger: ILogger
  private eventBus: IEventBus

  public constructor() {
    this.socketOnReady = []
    this.logger = new TempLogger('GameApi')
    this.eventBus = createEventBus(this.logger)
  }

  public connect(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = socketIo()
        this.onSocketReady(this.socket)
        return resolve(this.socket)
      } catch (err) {
        this.logger.err(err, 'Unable to setup socket io')
        this.emit(apiEvents.connectError)
        return reject(err)
      }
    })
  }

  public disconnect(): any {
    if (this.socket) {
      this.socket.close()
    }
  }


  public currentPlayer = {
    submitProfile: (profile: IPlayerProfile) => {
      if (!this.socket) {
        throw new Error(errorMessages.CONNECT_BEFORE_PATCH)
      }
      this.socket.emit(apiEvents.newPlayerIn, profile)
    },
  }

  public cells = {
    patch: (positions: IPos[]) => {
      if (!this.socket) {
        throw new Error(errorMessages.CONNECT_BEFORE_PATCH)
      }
      return new Promise((resolve, reject) => {
        this.socket.emit(apiEvents.playerPatchCell, positions, (response: IResponse) => {
          if (response.success) {
            return resolve(response)
          }
          return reject(response)
        })
      })
    },
  }

  public emit(eventKey: string, ...args) {
    this.eventBus.emit(eventKey, ...args)
  }

  public on(eventKey: string, callback: any) {
    const log = () => this.logger.info({ eventKey }, 'socket event mounted')
    this.eventBus.on(eventKey, callback)
  }

  private onSocketReady(socket) {
    this.socket.on(apiEvents.context, (context: IPlayerContext) => {
      // deserialize the object
      const clientContext: ClientContext = {
        currentPlayer: context.player,
        presetPatternBoards: context.presetPatternBoards
          .map(boardObj => Board.clone(boardObj)),
      }
      this.emit(apiEvents.context, clientContext)
    })

    this.socket.on(apiEvents.gameStateUpdate, (gameState: IGameState) => {
      if (gameState.board) {
        const board: GameBoard = gameState.board
        // deserialize the plain object to class
        gameState.board = (GameBoard.clone(board))
      }
      this.emit(apiEvents.gameStateUpdate, gameState)
    })

    this.socket.on(socketEvents.error, (error) => {
      this.emit(socketEvents.error, error)
    })

    this.socket.on('connect_error', (error) => {
      this.disconnect()
      this.emit(apiEvents.connectError, error)
    })
  }
}

