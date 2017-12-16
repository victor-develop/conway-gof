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

const mainTestTitle = 'Client test'
const logger = new TempLogger(mainTestTitle)

describe('Client test', () => {
  it('should update state after event fired', (done) => {
    const aGameApi = mockGameApi(logger, createEventBus())
    const aGameState = mockGameState(logger)
    const client = Client
      .create(logger)(createEventBus(), initialClientState, aGameApi, noticer)
    aGameApi.emit(apiEvents.IGameStateUpdate, aGameState)
    const clientState = client.appState
    assert.deepEqual(client.appState.game, aGameState)
    done()
  })
})
