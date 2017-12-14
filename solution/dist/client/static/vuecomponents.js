(function(window) {

  const mods = window.mods;
  const Vue = window.Vue;

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

  Vue.component('cell', {
    template: `<span class="cell" v-bind:style="styleObject"></span>`,
    props: ['x', 'y', 'board'],
    computed: {
      styleObject: function() {
        const cells = this.board.cells;
        if(!(cells[this.x] && cells[this.x][this.y])) {
          return {};
        }
        const cell = cells[this.x][this.y];
        return {
          backgroundColor: cell.overlayColor
        };
      }
    }
  })

  // TODO: feature: explore borderless board
  Vue.component('game-board', {
    template: `<table class="board">
                <tbody>
                  <tr v-for="h in board.height">
                    <td v-for="w in 60">
                      <cell :x=w-1 :y=h-1 :board=board></cell>
                    </td>
                  </tr>
                </tbody>
              </table>
            `,
    props: ['board']
  });

/*
  Vue.component('pattern-pos', {
    template: `<span class="cell" v-bind:style="styleObject"></span>`,
    props: ['x', 'y', 'color'],
    computed: {
      styleObject: function() {
        const cells = this.board.cells;
        if(!(cells[this.x] && cells[this.x][this.y])) {
          return {};
        }
        const cell = cells[this.x][this.y];
        return {
          backgroundColor: this.color
        };
      }
    }    
  })

  Vue.component('pattern-board', {
    template: `
    <table class="board">
        <tbody>
          <tr v-for="h in height">
            <td v-for="w in width">
              <pattern-pos :x=w-1 :y=h-1 :color=color :board=patternBoard></pattern-pos>
            </td>
          </tr>
        </tbody>
      </table>
    `,
    props: ['pattern', 'height', 'width'],
    data: function() {

      const patternBoard = mods.Board(10, 10, this.pattern)

      return {
        patternBoard: {
          
        }
      }
    }
  })
*/
})(window)