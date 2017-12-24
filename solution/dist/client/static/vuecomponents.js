function setupVueComponents(Vue) {

  Vue.component('player-banner', {
    template:`<span>
                <span v-if="player.uid == currentPlayer.uid">></span>
                {{ player.name }}
                <span class="player-color" v-bind:style="styleObject"></span>
              </span>
             `,
    props: ['player', 'currentPlayer'],
    computed: {
      styleObject: function() {
        return {
          backgroundColor: this.player.color
        }
      }
    }
  });

  Vue.component('color-pos',{
    template: `<span class="color-pos" v-bind:style="styleObject"></span>`,
    props: ['color'],
    computed: {
      styleObject: function() {
        return {
          backgroundColor: this.color
        };
      }
    }    
  })

  Vue.component('cell', {
    template: `<span class="cell"><color-pos :color=color></color-pos></span>`,
    props: ['x', 'y', 'board'],
    computed: {
      color: function() {
        if (this.board.isValidPos({x: this.x, y: this.y})) {
          return this.board.cells[this.x][this.y].overlayColor
        }
        return null
      }
    }
  })

  // TODO: feature: explore borderless board
  Vue.component('game-board', {
    template: `<table class="board game-board">
                <tbody>
                  <tr v-for="h in board.height">
                    <td v-for="w in board.width" v-on:click="patchPosition(w-1, h-1)">
                      <cell :x=w-1 :y=h-1 :board=board></cell>
                    </td>
                  </tr>
                </tbody>
              </table>
            `,
    props: ['board'],
    methods: {
      patchPosition: function(x, y) {
        this.$emit('patch-position', {x, y})
      },
    }
  });

  Vue.component('pattern-board', {
    template:`
    <popover content="Click on game board to place this pattern" trigger="manual" v-model="selected">
      <table class="board pattern-board" type="primary" v-on:click="select(board)">
      <tbody>
          <tr v-for="h in board.height">
            <td v-for="w in board.width"  >
              <color-pos class="pattern-pos" :color=color v-if="hasValue(w-1, h-1)" ></color-pos>
            </td>
          </tr>
        </tbody>
      </table>
    </popover>
    `,
    props: ['color', 'board', 'selected'],
    methods: {
      hasValue: function(x, y) {
        const offsetX = parseInt(this.board.width/3);
        const offsetY = parseInt(this.board.height/3);
        return this.board.isValidPos({ x: x - offsetX, y: y - offsetY });
      },
      select: function(board) {
        this.$emit('select', board)
      }
    },
  })
}
