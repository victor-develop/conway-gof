/*
import IPlayer from '../../common/src/gamemodels/iplayer'
import Vue from 'vue'
import { Client } from './client'
import { ClientState, initialClientState, InitialValue, ClientContext } from './client-state'
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
import { GameApi } from './gameapi/gameapi'
import { logEventBus } from '../../common/src/log-event-bus'
import * as socketIo from 'socket.io-client'
import { playerEventType } from './event-types';
import { IPlayerProfile } from '../../common/src/api/i-player-profile';
import { socketEvents } from '../../common/src/api/socket-events';

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

  // utilize Vue's event feature
  const mainEventBus: IEventBus = logEventBus(tempLogger, {
    emit: (eventKey, ...args) => {
      app.$emit(eventKey, ...args)
    },
    on: (eventKey: string, callback) => {
      app.$on(eventKey, callback)
    },
  })

  const mockNotice: INotice = {
    notice: (<any>app).$notify,
  }

  function setClientApiService() {
    const socket = socketIo()
    const client: GameClient
    mainEventBus.on(playerEventType.submitProfile, (profile: IPlayerProfile) => {
      socket.emit(apiEvents.newPlayerIn, profile)
    })
    mainEventBus.on(playerEventType.patchCellsAttempt, (positions: IPos[]) => {
      socket.emit(apiEvents.playerPatchCell, positions)
    })
    socket.on(apiEvents.context, (context: ClientContext) => {
      client.updateContext(context)
    })
    socket.on(apiEvents.gameStateUpdate, (state) => {
      client.updateGameState(state)
    })

    socket.on(socketEvents.disconnect, () => client.hang('Server disconneted.'))
    socket.on(socketEvents.error, (error) => {
      client.hang('Connnection erorr with server.')
    })
  }

}
*/

