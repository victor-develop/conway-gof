(function(window){
  
    document.addEventListener("DOMContentLoaded", ready);
  
    // TODO: failure handling
    function ready() {

      const Vue = window.Vue;

      setupVueComponents(Vue);

      const game = window.mods.game;

      const players = window.mods.players;

      const tick2 = window.mods.tick2;
    
      const currentPlayer = window.mods.currentPlayer;

      const presetPatternBoards = window.mods.presetPatternBoards

      const clientState = {
        context: {
          currentPlayer
        },
        game: {
          updateAt: Date.now(),
          players,
          board: game.board,
          presetPatternBoards
        }
      }

      const app = new Vue({
        el: '#app',
        data: mods.initialClientState(),
        methods: {
          hasInit: function(item) {
            return item == mods.InitialValue
          }
        }
      })
      mods.notices.forEach(notice => {
        app.$notify(notice);
      });
      /*
      setInterval(() => {
        if (app.game.board == game.board) {
          app.game.board = tick2.board;
        }
        else {
          app.game.board = game.board;
        }
      }, 1000);
      */
    }

  })(window);
  