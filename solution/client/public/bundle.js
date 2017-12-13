(function(window){

  document.addEventListener("DOMContentLoaded", ready);

  // "Class" definitions
  const Cell = (x, y, uid) => { 
    return { x, y, uid } 
  };

  const Board = (width, height, cells) => {
    return {
      width,
      height,
      cells
    }
  };

  // sample game
  const game = {
    board: Board(5, 5, [
      Cell(1, 2, 'aaa'),
      Cell(2, 2, 'aaa'),
      Cell(3, 2, 'aaa')
    ])
  }

  function ready() {
    const Vue = window.Vue;
    Vue.component('game-board', {
      template: `<table class="board">
                  <tbody>
                    <tr v-for="h in board.height" >
                      <td v-for="w in board.width"></td>
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
    })
  }
})(window);
