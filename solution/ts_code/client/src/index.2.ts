import IPlayer from '../../common/src/gamemodels/iplayer'
import Vue from 'vue'
import * as uiv from 'uiv'
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
import { GameApi } from './gameapi/gameapi'
import { logEventBus } from '../../common/src/attach-logger'
import { playerEventType } from './event-types';
import { IPlayerProfile } from '../../common/src/api/i-player-profile';

window.addEventListener('DOMContentLoaded', boot)

const logMessages = {
  STARTING: 'starting the whole application',
}

function boot() {

  Vue.use(uiv);
  // from legacy js file
  (<any>window).setupVueComponents(Vue)

  const app = new Vue({
    el: '#app',
    data: initialClientState(),
    methods: {
      hasInit: item => (item !== InitialValue.instance),
      // tslint:disable-next-line:object-literal-shorthand
      putPosition: function(position: IPos) {
        this.$emit(playerEventType.putCellsAttempt, [position])
      },
      // tslint:disable-next-line:object-literal-shorthand
      getName: function() {
        return this.$prompt({
          title: 'Welcome',
          content: 'Please set a player name for yourself:',
          // A simple input validator
          // returns the err msg (not valid) or null (valid)
          validator (value) {
            return /^[a-zA-z]+$/.test(value) ? null : 'You must give a name composed of letters only'
          },
        })
        .then((name) => {
          this.playername = name
          return this.playername
        })
        .catch(() => this.getName())
      },
    },
  })

  const notifyErrors = () => {
    const errorsToNotify = app.errors.filter(err => !err.notified)

    errorsToNotify.forEach((err) => {
      (<any>app).$notify({
        type:'danger',
        content: err.message,
      })
      err.notified = true
    })
    window.requestAnimationFrame(notifyErrors)
  }
  notifyErrors()

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

  const gameApi = new GameApi()

  //const aGameApi = mockGameApi(tempLogger, createEventBus(tempLogger))

  const mockNotice: INotice = {
    notice: (<any>app).$notify,
  }

  const resolveClient = Client.create(tempLogger)(mainEventBus, <any>app, gameApi, mockNotice)
  resolveClient
    .then((client) => {
      (<any>client.clientState).getName()
      .then((name) => {
        const profile: IPlayerProfile = {
          name,
        }
        mainEventBus.emit(playerEventType.submitProfile, profile)
      })
    })
/*
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
*/
}
