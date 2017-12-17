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
import { IEventBus } from './ievent-bus'
import { mockGameApi } from '../tests/mocks/mock-game-api'
import { createEventBus } from './event-bus';

window.addEventListener('DOMContentLoaded', boot)

const logMessages = {
  STARTING: 'starting the whole application',
}

function boot() {

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

  //const client = Client.create(tempLogger)(mainEventBus, <any>app, aGameApi, mockNotice)

  //return client

}
