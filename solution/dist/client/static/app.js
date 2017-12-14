(function(window){
  
    document.addEventListener("DOMContentLoaded", ready);
  
    function ready() {
      const Vue = window.Vue;

      const game = window.mods.game;

      const players = window.mods.players;

      const tick2 = window.mods.tick2;
    
      const currentPlayer = window.mods.currentPlayer;

      const app = new Vue({
        el: '#app',
        data: {
          game,
          currentPlayer,
          players
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
  