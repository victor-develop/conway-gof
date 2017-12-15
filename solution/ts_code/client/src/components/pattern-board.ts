import Vue from 'vue'
import { Board } from '../../../common/src/gamemodels/board'

export default Vue.extend({
  template:`
  <table class="board">
  <tbody>
      <tr v-for="h in height">
        <td v-for="w in width">
          <color-pos class="pattern-pos" :color=color v-if="hasValue(w-1, h-1)" ></color-pos>
        </td>
      </tr>
    </tbody>
  </table>
  `,
  props: ['height', 'width', 'color' ,'board'],
  methods: {
    hasValue(x: number, y:number): boolean {
      return (<Board>this.board).isValidPos({ x, y })
    },
  },
})

