(function(window){
  
    document.addEventListener("DOMContentLoaded", ready);
  
    const logger = {
      info: console.log,
      err: console.log
    };
  
    const CellState = {
      ActiveStill: 'ActiveStill',
      AliveFromDeath: 'AliveFromDeath'
    };
  
    // "Class" definitions
    const Cell = (x, y, uid, state, overlayColor) => { 
      return { x, y, uid, state, overlayColor } 
    };
  
    const Board = (width, height, cells) => {
  
      const hashCells = {};
  
      try {
        cells.forEach(cell => {
          hashCells[cell.x] = hashCells[cell.x] || {};
          hashCells[cell.x][cell.y] = cell;
        });
      }
      catch(e) {
        logger.err(e);
        throw e;
      }
  
      return {
        width,
        height,
        cells: hashCells
      }
    };
  
    const Player = (uid, color, name) => {
      return {
        uid,
        color,
        name
      }
    }
  
    // sample data models
    const players = [
      Player('aaa', '#226ad6', 'Tom'),
      Player('bbb', '#f20cdb', 'Cat'),
      Player('ccc', '#0d6d06', 'Fok')
    ]
  
    const currentUser = players[0];
    
    const game = {
      board: Board(20, 20, [
        Cell(0, 1, 'aaa', CellState.ActiveStill, 'red'),
        Cell(1, 1, 'aaa', CellState.ActiveStill,'blue'),
        Cell(2, 1, 'aaa', CellState.AliveFromDeath, 'green')
      ])
    }

    const tick2 = {
      board: Board(20, 20, [
        Cell(1, 0, 'aaa', CellState.ActiveStill, 'red'),
        Cell(1, 1, 'aaa', CellState.ActiveStill,'blue'),
        Cell(1, 2, 'aaa', CellState.AliveFromDeath, 'green')
      ])
    }
  
    function ready() {
      const Vue = window.Vue;
  
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
    
      const app = new Vue({
        el: '#app',
        data: {
          game
        }
      });

      setInterval(() => {
        if (app.game == game) {
          app.game = tick2;
        }
        else {
          app.game = game;
        }
      }, 1000);
    }
  })(window);
  