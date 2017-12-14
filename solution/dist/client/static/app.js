(function(window){
  
    document.addEventListener("DOMContentLoaded", ready);
  
    // TODO: failure handling
    function ready() {

      const Vue = window.Vue;

      const game = window.mods.game;

      const players = window.mods.players;

      const tick2 = window.mods.tick2;
    
      const currentPlayer = window.mods.currentPlayer;

      const presetPatternBoards = window.mods.presetPatternBoards

      const app = new Vue({
        el: '#app',
        data: {
          game,
          currentPlayer,
          players,
          presetPatternBoards,
          config: {
            pattern: {
              board: {
                height: 10,
                width: 10
              }
            }
          }
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
  