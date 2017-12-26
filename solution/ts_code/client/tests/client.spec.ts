import 'mocha'
import * as assert from 'assert'
import { Client } from '../src/client'
import { initialClientState } from '../src/client-state'
import { mockGameApi, mockGameApiResponse } from './mocks/mock-game-api'
import noticer from './mocks/mock-notice'
import { createEventBus } from '../../common/src/create-event-bus'
import { apiEvents } from '../../common/src/api/api-events'
import { playerEventType } from '../src/event-types'
import { presetPatterns } from '../../common/src/gamemodels/preset-pattern'
import IPos from '../../common/src/gamemodels/ipos'
import { INotice } from '../src/inotice'
import { mockGameStates } from './mocks/mock-game-state'
import { clientContext } from './mocks/mock-client-context'
import { IGameState } from '../../common/src/gamemodels/i-game-state'
import { logger } from '../../server/src/logger'

const mainTestTitle = 'Client test'

logger.child(mainTestTitle)
  .then(runTest)

function runTest(aLogger) {
  describe('Client test', () => {

    describe('server emits event to update client context', () => {
      it('should update current player information', (done) => {
        const aGameApi = mockGameApi(aLogger, createEventBus(aLogger))
        const clientState = initialClientState()
        Client
          .create(aLogger)(createEventBus(aLogger), clientState, aGameApi, noticer)
          .then((client) => {
            aGameApi.emit(apiEvents.context, clientContext.default)
            assert.deepEqual(clientState.context, clientContext.default)
            done()
          })
      })
    })

    describe('server emits event to update players list', () => {
      it('should update players list', (done) => {
        const aGameApi = mockGameApi(aLogger, createEventBus(aLogger))
        const clientState = initialClientState()
        const createClient = () => Client
        Client
          .create(aLogger)(createEventBus(aLogger), clientState, aGameApi, noticer)
          .then((client) => {
            aGameApi.emit(apiEvents.gameStateUpdate, mockGameStates.playersOnly)
            const clientPlayers = (<IGameState>clientState.game).players
            aLogger.info(clientPlayers)
            assert.deepEqual(clientPlayers, mockGameStates.playersOnly.players)
            done()
          })
      })
    })

    describe('server emits event to update client game state', () => {
      it('should update game state after event fired', (done) => {
        const aGameApi = mockGameApi(aLogger, createEventBus(aLogger))
        const aGameState = mockGameStates.full
        const clientState = initialClientState()
        Client
        .create(aLogger)(createEventBus(aLogger), clientState, aGameApi, noticer)
        .then((client) => {
          aGameApi.emit(apiEvents.gameStateUpdate, aGameState)
          aLogger.info(clientState.game)
          assert.deepEqual(clientState.game, aGameState)
          done()
        })
      })
    })

    describe('IPlayer try to patch some cells', () => {

      const positionsToPut = presetPatterns[1]

      it('should call gameApi.patch after event fired, and will fail by timeout', (done) => {
        const aGameApi = mockGameApi(aLogger, createEventBus(aLogger), {
          patchCallback: (positions) => {
            assert.deepEqual(positions, positionsToPut)
            done()
          },
          submitProfileCallback: null,
        })
        const clientEventBus = createEventBus(aLogger)
        Client
          .create(aLogger)(clientEventBus, initialClientState(), aGameApi, noticer)
          .then((client) => {
            clientEventBus.emit(playerEventType.patchCellsAttempt, positionsToPut)
          })
      })

      it('should notify user of error if gameApi.patch fails, and will fail by timeout', (done) => {
        const aGameApi = mockGameApi(aLogger, createEventBus(aLogger))
        aGameApi.cells.patch = (positions: IPos[]) => {
          return Promise.reject(mockGameApiResponse.failCellPatch)
        }
        aGameApi.cells.patch([])
        const aNoticer: INotice = {
          notice: (messages) => { done() },
        }
        const clientEventBus = createEventBus(aLogger)
        Client
        .create(aLogger)(clientEventBus, initialClientState(), aGameApi, aNoticer)
        .then((client) => {
          clientEventBus.emit(playerEventType.patchCellsAttempt, positionsToPut)
        })
      })
    })
  })
}

