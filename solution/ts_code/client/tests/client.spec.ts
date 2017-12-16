import 'mocha'
import * as assert from 'assert'
import { Client } from '../src/client'
import TempLogger from '../../common/src/temp-logger'
import { initialClientState } from '../src/client-state'
import { mockGameApi, mockGameApiResponse } from './mocks/mockGameApi'
import noticer from './mocks/mockNotice'
import { createEventBus } from '../src/event-bus'
import { apiEvents } from '../../common/src/api/api-events'
import { mockGameState } from './mocks/mockGameState'
import { playerEventType } from '../src/event-types'
import { presetPatterns } from '../../common/src/gamemodels/preset-pattern'
import IPos from '../../common/src/gamemodels/ipos';
import { INotice } from '../src/inotice';

const mainTestTitle = 'Client test'
const logger = new TempLogger(mainTestTitle)

describe('Client test', () => {
  it('should update game state after event fired', (done) => {
    const aGameApi = mockGameApi(logger, createEventBus())
    const aGameState = mockGameState(logger)
    const createClient = () => Client
      .create(logger)(createEventBus(), initialClientState, aGameApi, noticer)
    const client = createClient()

    aGameApi.emit(apiEvents.IGameStateUpdate, aGameState)
    const clientState = client.clientState
    assert.deepEqual(client.clientState.game, aGameState)
    done()
  })

  const positionsToPut = presetPatterns[1]
  it('should call gameApi.patch after event fired, and will fail by timeout', (done) => {
    const aGameApi = mockGameApi(logger, createEventBus(), {
      patchCallback: (positions) => {
        assert.deepEqual(positions, positionsToPut)
        done()
      },
    })
    const client = Client
      .create(logger)(createEventBus(), initialClientState, aGameApi, noticer)
    client.clientEvent.emit(playerEventType.putCellsAttempt, positionsToPut)
  })

  it('should notify user of error if gameApi.patch fails, and will fail by timeout', (done) => {
    const aGameApi = mockGameApi(logger, createEventBus())
    aGameApi.cells.patch = (positions: IPos[]) => Promise.reject(mockGameApiResponse.failCellPatch)

    const aNoticer: INotice = {
      notice: (messages) => { done() },
    }

    const client = Client
    .create(logger)(createEventBus(), initialClientState, aGameApi, aNoticer)
    client.clientEvent.emit(playerEventType.putCellsAttempt, positionsToPut)
  })
})
