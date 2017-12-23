import { IEventBus } from '../../../common/src/ievent-bus'
import { Game } from './game'
import { apiEvents } from '../../../common/src/api/api-events'
import IPlayer from '../../../common/src/gamemodels/iplayer'
import { ConnectedClientContext } from '../../../common/src/gamemodels/connected-client-context'
import { socketEvents } from '../../../common/src/api/socket-events'
import IPos from '../../../common/src/gamemodels/ipos'
import { ILogger } from '../../../common/src/services'
import { IPlayerProfile } from '../../../common/src/api/i-player-profile'

export function setApiService(io: SocketIO.Server, toplogger: ILogger, game: Game) {

  const gameEventBus = game.events

  const setup = (logger: ILogger) => {

    logger.info('setting up ApiService with Game instance')

    io.on(socketEvents.error, (error) => {
      logger.err(error, 'SocketIO client error')
    })

    gameEventBus.on(apiEvents.gameStateUpdate, (gameState) => {
      logger.info(apiEvents.gameStateUpdate, 'ready to emit gamestateupdate')
      // broadcast to everyone
      io.emit(apiEvents.gameStateUpdate, gameState)
    })

    logger.info('mount connect event')
    io.on(socketEvents.connect, (socket: any) => {
      logger.info(socketEvents.connect, 'event captured')

      socket.on(apiEvents.newPlayerIn, (profile: IPlayerProfile) => {
        logger.info(apiEvents.newPlayerIn, 'event captured')
        game.newPlayer(profile.name)
          .then((playerContext) => {
            const currentPlayer = playerContext.player
            const removePlayer = () => game.removePlayer(currentPlayer)

            socket.on(socketEvents.disconnect, removePlayer)
            socket.on(apiEvents.playerOut, removePlayer)

            socket.on(apiEvents.playerPatchCell, (positions: IPos[], callback) => {
              game.playerPatchCells(currentPlayer, positions)
                .then(response => callback(response))
            })

            socket.on(socketEvents.error, (error) => {
              logger.err({ currentPlayer, error }, 'Something wrong with player\'s socket connection')
            })

            socket.emit(apiEvents.context, playerContext)
          })
      })
    })
    return Promise.resolve(io)
  }
  return toplogger.child('apiService - socketio')
    .then(setup)
}
