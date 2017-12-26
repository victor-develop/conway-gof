import { Board } from '../../common/src/gamemodels/board'
import Vue from 'vue'
import * as uiv from 'uiv'
import { initialClientState, InitialValue } from './client-state'
import IPos from '../../common/src/gamemodels/ipos'
import { playerEventType } from './event-types'
import GameBoard from '../../common/src/gamemodels/game-board'

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math
    .random() * (max - min)) + min
}

function getRandomPoint(board: GameBoard): IPos {
  const positions = board.allPositions().filter(p => !board.isValidPos(p))
  const index = getRandomInt(0, positions.length -1)
  return positions[index]
}

export function setVueApp() {
  Vue.use(uiv);
  // from legacy js file
  (<any>window).setupVueComponents(Vue)

  const app = new Vue({
    el: '#app',
    data: initialClientState(),
    methods: {
      hasInit: item => (item !== InitialValue.instance),
      patchPosition(cursorPoint: IPos) {
        if (this.selectedPattern === InitialValue.instance) {
          return this.$emit(playerEventType.patchCellsAttempt, [cursorPoint])
        }
        return this.patchPattern(cursorPoint)
      },
      patchPatternRandomly() {
        const board: GameBoard = this.game.board
        return this.patchPattern(getRandomPoint(board))
      },
      patchPattern(from: IPos) {
        const shiftedPositions = (<Board>this.selectedPattern).validPositions()
        .map((pos) => {
          const shiftedPosition = { x: pos.x + from.x, y: pos.y + from.y }
          return shiftedPosition
        })
        this.$emit(playerEventType.patchCellsAttempt, shiftedPositions)
        this.selectedPattern = InitialValue.instance
      },
      selectPattern(board) {
        this.selectedPattern = board
        if (this.patchPatternMode === 'random') {
          this.patchPatternRandomly()
        }
      },
      getName() {
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
    const errorsToNotify = app.errors.filter(err => (err.notified !== true))

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
