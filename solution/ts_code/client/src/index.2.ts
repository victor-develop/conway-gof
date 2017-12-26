
import { setVueApp } from './set-vue-app'
import { ILogger } from '../../common/src/services'
import TempLogger from '../../common/src/temp-logger'
import { IEventBus } from '../../common/src/ievent-bus'
import { logEventBus } from '../../common/src/log-event-bus'
import { GameApi } from './gameapi/gameapi'
import { INotice } from './inotice'
import { Client } from './client'
import { IPlayerProfile } from '../../common/src/api/i-player-profile'
import { playerEventType } from './event-types'

window.addEventListener('DOMContentLoaded', boot)

const logMessages = {
  STARTING: 'starting the whole application',
}

function boot() {

  const tempLogger: ILogger = new TempLogger(logMessages.STARTING)

  const app = setVueApp()

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

  const noticer: INotice = {
    notice: (<any>app).$notify,
  }

  const resolveClient = Client.create(tempLogger)(mainEventBus, <any>app, gameApi, noticer)
  resolveClient
    .then((client) => {
      app.getName()
      .then((name) => {
        const profile: IPlayerProfile = {
          name,
        }
        mainEventBus.emit(playerEventType.submitProfile, profile)
      })
    })
}
