import IGameState from './game-state'
import Player from '../../common/src/gamemodels/player'
import Vue from 'vue'
import { Client } from './client'
import { ClientState, initialClientState } from './client-state'
import TempLogger from '../../common/src/temp-logger'
import { ILogger } from '../../common/src/services'
import { IGameApi } from './gameapi/IGameApi'
import IPos from '../../common/src/gamemodels/ipos'
import IResponse from '../../common/src/api/IResponse'
import { INotice } from './inotice'
import { IEventBus } from './ievent-bus'
import { mockGameApi } from '../tests/mocks/mockGameApi'

window.addEventListener('DOMContentLoaded', boot)

const logMessages = {
  STARTING: 'starting the whole application',
}

function boot(): Client {

  const app = new Vue({
    el: '#app',
    data: initialClientState,
  })

  const tempLogger: ILogger = new TempLogger(logMessages.STARTING)

  const eventBus: IEventBus = new Vue()

  const aGameApi = mockGameApi(tempLogger)

  const mockNotice: INotice = {
    notice: (<any>app).$notify,
  }

  const client = Client.create(tempLogger)(eventBus, <any>app, aGameApi, mockNotice)

  return client
}
