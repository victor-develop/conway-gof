import 'mocha'
import * as assert from 'assert'
import { Client } from '../src/client'
import { initialClientState } from '../src/client-state'
import { mockGameApi, mockGameApiResponse } from './mocks/mock-game-api'
import noticer from './mocks/mock-notice'
import { createEventBus } from '../src/event-bus'
import { apiEvents } from '../../common/src/api/api-events'
import { playerEventType } from '../src/event-types'
import { presetPatterns } from '../../common/src/gamemodels/preset-pattern'
import IPos from '../../common/src/gamemodels/ipos'
import { INotice } from '../src/inotice'
import { mockGameStates } from './mocks/mock-game-state'
import { clientContext } from './mocks/mock-client-context'
import { IGameState } from '../../common/src/gamemodels/game-state'
import { logger } from '../../server/src/helpers'

const mainTestTitle = 'Client test'

describe('Client test', () => {

  describe('server emits event to update client context', () => {
    it('should update current player information', (done) => {
      const aGameApi = mockGameApi(logger, createEventBus())
      Client
        .create(logger)(createEventBus(), initialClientState(), aGameApi, noticer)
        .then((client) => {
          aGameApi.emit(apiEvents.context, clientContext.default)
          assert.deepEqual(client.clientState.context, clientContext.default)
          done()
        })
    })
  })

  describe('server emits event to update players list', () => {
    it('should update players list', (done) => {
      const aGameApi = mockGameApi(logger, createEventBus())
      const createClient = () => Client
      Client
        .create(logger)(createEventBus(), initialClientState(), aGameApi, noticer)
        .then((client) => {
          aGameApi.emit(apiEvents.gameStateUpdate, mockGameStates.playersOnly)
          const clientPlayers = (<IGameState>client.clientState.game).players
          logger.info(clientPlayers)
          assert.deepEqual(clientPlayers, mockGameStates.playersOnly.players)
          done()
        })
    })
  })

  describe('server emits event to update client game state', () => {
    it('should update game state after event fired', (done) => {
      const aGameApi = mockGameApi(logger, createEventBus())
      const aGameState = mockGameStates.full
      Client
      .create(logger)(createEventBus(), initialClientState(), aGameApi, noticer)
      .then((client) => {
        aGameApi.emit(apiEvents.gameStateUpdate, aGameState)
        logger.info(client.clientState.game)
        assert.deepEqual(client.clientState.game, aGameState)
        done()
      })
    })
  })

  describe('IPlayer try to patch some cells', () => {

    const positionsToPut = presetPatterns[1]

    it('should call gameApi.patch after event fired, and will fail by timeout', (done) => {
      const aGameApi = mockGameApi(logger, createEventBus(), {
        patchCallback: (positions) => {
          assert.deepEqual(positions, positionsToPut)
          done()
        },
      })
      Client
        .create(logger)(createEventBus(), initialClientState(), aGameApi, noticer)
        .then((client) => {
          client.clientEvent.emit(playerEventType.putCellsAttempt, positionsToPut)
        })
    })

    it('should notify user of error if gameApi.patch fails, and will fail by timeout', (done) => {
      const aGameApi = mockGameApi(logger, createEventBus())
      aGameApi.cells.patch = (positions: IPos[]) =>
        Promise.reject(mockGameApiResponse.failCellPatch)

      const aNoticer: INotice = {
        notice: (messages) => { done() },
      }

      Client
      .create(logger)(createEventBus(), initialClientState(), aGameApi, aNoticer)
      .then((client) => {
        client.clientEvent.emit(playerEventType.putCellsAttempt, positionsToPut)
      })
    })
  })

})
