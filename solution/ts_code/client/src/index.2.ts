import IGameState from './game-state'
import IPlayer from '../../common/src/gamemodels/iplayer'
import Vue from 'vue'
import { Client } from './client'
import { ClientState, initialClientState, InitialValue } from './client-state'
import TempLogger from '../../common/src/temp-logger'
import { ILogger } from '../../common/src/services'
import { IGameApi } from './gameapi/IGameApi'
import IPos from '../../common/src/gamemodels/ipos'
import IResponse from '../../common/src/api/IResponse'
import { INotice } from './inotice'
import { IEventBus } from '../../common/src/ievent-bus'
import { mockGameApi } from '../tests/mocks/mock-game-api'
import { createEventBus } from './event-bus'
import { apiEvents } from '../../common/src/api/api-events'
import { clientContext } from '../tests/mocks/mock-client-context'
import { mockGameStates } from '../tests/mocks/mock-game-state'
import { setInterval } from 'timers'

window.addEventListener('DOMContentLoaded', boot)

const logMessages = {
  STARTING: 'starting the whole application',
}

function boot() {

  // from legacy js file
  (<any>window).setupVueComponents(Vue)

  // will be used as ClientState 
  const app = new Vue({
    el: '#app',
    data: initialClientState(),
    methods: {
      hasInit: item => (item !== InitialValue.instance),
    },
  })

  const tempLogger: ILogger = new TempLogger(logMessages.STARTING)

  const mainEventBus: IEventBus = createEventBus()

  const aGameApi = mockGameApi(tempLogger, createEventBus())

  const mockNotice: INotice = {
    notice: (<any>app).$notify,
  }

  const resolveClient = Client.create(tempLogger)(mainEventBus, <any>app, aGameApi, mockNotice)

  resolveClient
  .then((client) => {
    // simluate the server
    aGameApi.emit(apiEvents.context, clientContext.default)
    aGameApi.emit(apiEvents.gameStateUpdate, mockGameStates.full)

    let mutex = true
    const duration = 1000
    setInterval(() => {

      const addUpdateAt = partialState =>
        Object.assign({}, partialState, { updateAt: Date.now() })

      if (mutex) {
        aGameApi.emit(apiEvents.gameStateUpdate, addUpdateAt(mockGameStates.gameTick1))
      } else {
        aGameApi.emit(apiEvents.gameStateUpdate, addUpdateAt(mockGameStates.gameTick2))
      }
      mutex = !mutex
    }, duration)
  })
}
