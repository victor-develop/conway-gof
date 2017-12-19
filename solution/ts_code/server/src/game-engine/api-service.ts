import { IEventBus } from '../../../common/src/ievent-bus'
import { ISendPlayer } from './game'
import { apiEvents } from '../../../common/src/api/api-events'
import IPlayer from '../../../common/src/gamemodels/iplayer'
import { ConnectedClientContext } from '../../../common/src/gamemodels/connected-client-context'
import { socketEvents } from '../../../common/src/api/socket-events'
import IPos from '../../../common/src/gamemodels/ipos'
import { ILogger } from '../../../common/src/services'

function apiService(io: SocketIO.Server, logger: ILogger, gameEventBus: IEventBus) {

  io.on(socketEvents.error, (error) => {
    logger.err(error, 'SocketIO client error')
  })

  io.on(socketEvents.connect, (socket: any) => {

    io.on(socketEvents.enter, (name: string) => {

      const sendContextToPlayer: ISendPlayer = (currentPlayer: IPlayer) => {
        const context: ConnectedClientContext = { currentPlayer }
        socket.broadcast.to(socket.id).emit(apiEvents.context, context)

        // set up listeners which are dependent on the player
        socket.on(socketEvents.disconnect,() => {
          gameEventBus.emit(apiEvents.playerOut, currentPlayer)
        })

        socket.on(apiEvents.playerPatchCell, (positions: IPos[]) => {
          gameEventBus.emit(apiEvents.playerPatchCell, currentPlayer, positions)
        })

        socket.on(socketEvents.error, (error) => {
          logger.err({ currentPlayer, error }, 'Something wrong with player\'s socket connection')
        })
      }

      gameEventBus.emit(apiEvents.newPlayerIn, name, sendContextToPlayer)
    })
  })
}
