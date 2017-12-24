import { IEventBus } from '../../../common/src/ievent-bus'
import { Game } from './game'
import { apiEvents } from '../../../common/src/api/api-events'
import IPlayer from '../../../common/src/gamemodels/iplayer'
import { ConnectedClientContext } from '../../../common/src/gamemodels/connected-client-context'
import { socketEvents } from '../../../common/src/api/socket-events'
import IPos from '../../../common/src/gamemodels/ipos'
import { ILogger } from '../../../common/src/services'
import { IPlayerProfile } from '../../../common/src/api/i-player-profile'
import { logEventBus } from '../../../common/src/log-event-bus'

export function setApiService(io: SocketIO.Server, toplogger: ILogger, game: Game) {

  const gameEventBus = game.events

  const setup = (logger: ILogger) => {

    logger.info('setting up ApiService with Game instance')

    const loggedIo = logEventBus(logger, io)

    loggedIo.on(socketEvents.error, (error) => {
      logger.err(error, 'SocketIO client error')
    })

    gameEventBus.on(apiEvents.gameStateUpdate, (gameState) => {
      // broadcast to everyone
      loggedIo.emit(apiEvents.gameStateUpdate, gameState)
    })

    loggedIo.on(socketEvents.connect, (socket: any) => {
      const loggedSocket = logEventBus(logger, socket)

      loggedSocket.on(apiEvents.newPlayerIn, (profile: IPlayerProfile) => {
        logger.info(apiEvents.newPlayerIn, 'event captured')
        game.newPlayer(profile.name)
          .then((playerContext) => {
            const currentPlayer = playerContext.player
            const removePlayer = () => game.removePlayer(currentPlayer)

            loggedSocket.on(socketEvents.disconnect, removePlayer)
            loggedSocket.on(apiEvents.playerOut, removePlayer)

            loggedSocket.on(apiEvents.playerPatchCell, (positions: IPos[], callback) => {
              game.playerPatchCells(currentPlayer, positions)
                .then(response => callback(response))
            })

            loggedSocket.on(socketEvents.error, (error) => {
              logger.err({ currentPlayer, error }, 'Something wrong with player\'s socket connection')
            })

            loggedSocket.emit(apiEvents.context, playerContext)
          })
      })
    })
    return Promise.resolve(io)
  }
  return toplogger.child('apiService - socketio')
    .then(setup)
}
