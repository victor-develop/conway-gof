import { Board } from '../../common/src/gamemodels/board'
import Vue from 'vue'
import * as uiv from 'uiv'
import { initialClientState, InitialValue } from './client-state'
import IPos from '../../common/src/gamemodels/ipos'
import { playerEventType } from './event-types'

export function setVueApp() {
  Vue.use(uiv);
  // from legacy js file
  (<any>window).setupVueComponents(Vue)

  const app = new Vue({
    el: '#app',
    data: initialClientState(),
    methods: {
      hasInit: item => (item !== InitialValue.instance),
      // tslint:disable-next-line:object-literal-shorthand
      patchPosition: function(point: IPos) {
        if (this.selectedPattern !== InitialValue.instance) {
          const shiftedPositions = (<Board>this.selectedPattern).validPositions()
            .map((pos) => {
              const shiftedPosition = { x: pos.x + point.x, y: pos.y + point.y }
              return shiftedPosition
            })
          this.selectedPattern = InitialValue.instance
          return this.$emit(playerEventType.patchCellsAttempt, shiftedPositions)
        }
        return this.$emit(playerEventType.patchCellsAttempt, [point])
      },
      // tslint:disable-next-line:object-literal-shorthand
      selectPattern: function(board) {
        this.selectedPattern = board
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

  return app
}
