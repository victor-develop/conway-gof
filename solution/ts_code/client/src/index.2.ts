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

  // TODO: implement a real one

  const mockGameApi: IGameApi = (function(){
    const response: IResponse = {
      messages: ['success'],
      success: true,
      errors: [],
      data: {

      },
    }
    return {
      connect: () => Promise.resolve(response),
      cells: {
        patch: (positions: IPos[]) => Promise.resolve(response),
      },
    }
  })()

  const mockNotice: INotice = {
    notice: (<any>app).$notify,
  }

  const client = Client.create(tempLogger)(eventBus, <any>app, mockGameApi, mockNotice)

  return client
}
