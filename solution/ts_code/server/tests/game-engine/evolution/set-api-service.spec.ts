import 'mocha'
import TempLogger from '../../../../common/src/temp-logger'
import { createEventBus } from '../../../../client/src/event-bus'
import { createGame } from '../../../src/services'
import { apiEvents } from '../../../../common/src/api/api-events'
import { socketEvents } from '../../../../common/src/api/socket-events'
import { setApiService } from '../../../src/game-engine/set-api-service'
import IPlayerContext from '../../../../common/src/gamemodels/iplayer-context'
import { IPlayerProfile } from '../../../../common/src/api/i-player-profile'
import * as assert from 'assert'
import { mockGameToolset } from '../../mocks/mock-game'
import { IGameState } from '../../../../common/src/gamemodels/i-game-state';

const logger = new TempLogger('set-api-service test')

describe('setApiService', () => {

  // this is required for following async tests to be detected
  it('Activate mocha', (done) => {
    done()
  })

  logger.child('mockSocketIo').then((mockSocketIoLogger) => {
    // mock the root socketIO object
    const mockSocketIo = createEventBus(mockSocketIoLogger)
    const aMockGameToolset = mockGameToolset(logger)

    setApiService(<any>mockSocketIo, logger, aMockGameToolset.game)
      .then(() => {
        describe('start socket connection with player A', () => {
          // mock the server-client connection
          const mockSocket = createEventBus(logger)

          const mockStart = mockSocketIo.emit(socketEvents.connect, mockSocket)

          describe('player A submits profile to server', () => {
            logger.info('hi im here')
            const profile: IPlayerProfile = {
              name: 'Player A',
            }

            const submitProfile = () => mockSocket.emit(apiEvents.newPlayerIn, profile)

            it('player A receives context information from server', (done) => {
              mockSocket.on(apiEvents.context, (context: IPlayerContext) => {
                assert.equal(context.player.name, profile.name)
                assert.ok(context.player.color)
                assert.ok(context.player.uid)
                assert.ok(context.presetPatternBoards)
                done()
              })
              submitProfile()
            })

            it('player A receives game state data from server for each round of evolution', (done) => {
              mockSocketIo.on(apiEvents.gameStateUpdate, (gamestate: IGameState) => {
                assert.ok(gamestate.board)
                assert.equal(gamestate.players.length, 1)
                assert.equal(gamestate.players[0].name, profile.name)
                assert.ok(gamestate.updateAt)
                done()
              })
              // trigger one round of evolution
              aMockGameToolset.evolveEvent.emit('tick')
              aMockGameToolset.jobQueueEvent.emit('tick')
            })
          })

        })
      })
  })
})
