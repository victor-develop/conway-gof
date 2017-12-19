import { IGameApi } from './IGameApi'
import IResponse from '../../../common/src/api/IResponse'
import * as socketIo from 'socket.io-client'
import { config } from '../../../server/src/config/config'
import { socketEvents } from '../../../common/src/api/socket-events'
import IPos from '../../../common/src/gamemodels/ipos'
import { ILogger } from '../../../common/src/services'
import { apiEvents } from '../../../common/src/api/api-events'
import { EventEmitter } from 'eventemitter3'

const errorMessages = {
  CONNECT_BEFORE_PATCH: 'call connect() first in order to patch()',
  CONNECT_BEFORE_EMIT: 'call connect() first before emitting events',
}

export class GameApi implements IGameApi {
  private io: SocketIOClient.Socket
  // connected socket
  private socket: SocketIOClient.Socket
  private socketOnReady: ((socket: SocketIOClient.Socket) => void)[]

  public constructor() {
    this.socketOnReady = []
  }

  public connect(): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      this.io = socketIo(config.serverURL)
      this.io.on(socketEvents.connect, (socket) => {
        const response: IResponse = {
          success: true,
          messages: ['connect to server in socket successfully'],
          data: {
            socketId: socket.id,
          },
        }
        this.socket = socket

        const transferEvent = (eventKey: string) => {
          this.socket.on(eventKey, (...args) => {
            this.emit(eventKey, ...args)
          })
        }

        transferEvent(apiEvents.context)
        transferEvent(apiEvents.gameStateUpdate)

        while(this.socketOnReady.length > 0) {
          const hook = this.socketOnReady.shift()
          hook(this.socket)
        }

        resolve(response)
      })
    })
  }

  public cells = {
    patch: (positions: IPos[]) => {
      if (!this.socket) {
        throw new Error(errorMessages.CONNECT_BEFORE_PATCH)
      }
      this.socket.emit(apiEvents.playerPatchCell, positions)
      const response: IResponse = {
        success: true,
        messages: [],
        data: {},
      }
      return Promise.resolve(response)
    },
  }

  public emit(eventKey: string, ...args) {
    if (this.socket) {
      this.socket.emit(eventKey, ...args)
    } else {
      throw new Error(errorMessages.CONNECT_BEFORE_EMIT)
    }
  }
  
  public on(eventKey: string, callback: any) {
    if (this.socket) {
      this.socket.on(eventKey, callback)
      return
    }
    this.socketOnReady.push((socket) => {
      socket.on(eventKey, callback)
    })
  }
}

