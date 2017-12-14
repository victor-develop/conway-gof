(function(window){
  
    document.addEventListener("DOMContentLoaded", ready);
  
    function ready() {
      const Vue = window.Vue;

      const game = window.game;

      const players = window.players;

      const tick2 = window.tick2;
    
      const currentPlayer = window.currentPlayer;

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
  