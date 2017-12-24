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
import { IGameState } from '../../../../common/src/gamemodels/i-game-state'
import { logger } from '../../../src/logger'

// const logger = new TempLogger('set-api-service test')

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

          // send the socket to the Game object
          mockSocketIo.emit(socketEvents.connect, mockSocket)

          describe('player A submits profile to server', () => {

            const profile: IPlayerProfile = {
              name: 'Player A',
            }

            const submitProfile = () => mockSocket.emit(apiEvents.newPlayerIn, profile)

            it('player A receives context information and initial game state from server', (done) => {
              const monitor = createEventBus(logger)
              mockSocket.on(apiEvents.context, (context: IPlayerContext) => {
                assert.equal(context.player.name, profile.name)
                assert.ok(context.player.color)
                assert.ok(context.player.uid)
                assert.ok(context.presetPatternBoards)
                monitor.emit('done', apiEvents.context)
              })
              // prevent multiple times of calling done()
              let tested = false
              mockSocketIo.on(apiEvents.gameStateUpdate, (gamestate: IGameState) => {
                if (!tested) {
                  assert.deepEqual(gamestate.board.cells, {})
                  assert.equal(gamestate.players.length, 1)
                  assert.equal(gamestate.players[0].name, profile.name)
                  assert.ok(gamestate.updateAt)
                  tested = true
                  monitor.emit('done', apiEvents.gameStateUpdate)
                }
              })

              const checked = {}
              monitor.on('done', (eventkey) => {
                checked[eventkey] = true
                if (checked[apiEvents.context] && checked[apiEvents.gameStateUpdate]) {
                  done()
                }
              })

              submitProfile()
            })

            let randomCellsGot = false
            let evolutionGot = false

            it('player A receives game state data with random cells on the board', (done) => {
              mockSocketIo.on(apiEvents.gameStateUpdate, (gamestate: IGameState) => {
                if (!randomCellsGot) {
                  assert.notDeepEqual(gamestate.board.cells, {})
                  assert.ok(gamestate.board)
                  done()
                  randomCellsGot = true
                }
              })
              aMockGameToolset.jobQueueEvent.emit('tick')
            })

            it('player A receives game state data from server for each round of evolution', (done) => {
              mockSocketIo.on(apiEvents.gameStateUpdate, (gamestate: IGameState) => {
                if (!evolutionGot) {
                  assert.notDeepEqual(gamestate.board.cells, {})
                  assert.ok(gamestate.board)
                  done()
                  evolutionGot = true
                }
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
