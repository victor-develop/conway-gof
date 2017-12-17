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
    template: `<table class="board">
                <tbody>
                  <tr v-for="h in board.height">
                    <td v-for="w in board.width">
                      <cell :x=w-1 :y=h-1 :board=board></cell>
                    </td>
                  </tr>
                </tbody>
              </table>
            `,
    props: ['board']
  });

  Vue.component('pattern-board', {
    template:`
    <table class="board pattern-board">
    <tbody>
        <tr v-for="h in board.height">
          <td v-for="w in board.width">
            <color-pos class="pattern-pos" :color=color v-if="hasValue(w-1, h-1)" ></color-pos>
          </td>
        </tr>
      </tbody>
    </table>
    `,
    props: ['color', 'board'],
    methods: {
      hasValue: function(x, y) {
        const offsetX = parseInt(this.board.width/3);
        const offsetY = parseInt(this.board.height/3);
        return this.board.isValidPos({ x: x - offsetX, y: y - offsetY });
      },
    },
  })
}
