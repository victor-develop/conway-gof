import 'mocha'
import * as assert from 'assert'
import { Client } from '../src/client'
import TempLogger from '../../common/src/temp-logger'
import { initialClientState } from '../src/client-state'
import { mockGameApi } from './mocks/mockGameApi'
import noticer from './mocks/mockNotice'
import { createEventBus } from '../src/event-bus'
import { apiEvents } from '../../common/src/api/api-events'
import { mockGameState } from './mocks/mockGameState'
import { playerEventType } from '../src/event-types'
import { presetPatterns } from '../../common/src/gamemodels/preset-pattern'

const mainTestTitle = 'Client test'
const logger = new TempLogger(mainTestTitle)

describe('Client test', () => {
  const aGameApi = mockGameApi(logger, createEventBus())
  const aGameState = mockGameState(logger)
  const createClient = () => Client
    .create(logger)(createEventBus(), initialClientState, aGameApi, noticer)

  it('should update game state after event fired', (done) => {
    const client = createClient()
    aGameApi.emit(apiEvents.IGameStateUpdate, aGameState)
    const clientState = client.clientState
    assert.deepEqual(client.clientState.game, aGameState)
    done()
  })

  it('should call gameApi.patch after event fired, and will fail by timeout', (done) => {
    const positionsToPut = presetPatterns[1]
    const testPatchGameApi = mockGameApi(logger, createEventBus(), {
      patchCallback: (positions) => {
        assert.deepEqual(positions, positionsToPut)
        done()
      },
    })
    const client = Client
      .create(logger)(createEventBus(), initialClientState, testPatchGameApi, noticer)
    client.clientEvent.emit(playerEventType.putCellsAttempt, positionsToPut)

  })
})
