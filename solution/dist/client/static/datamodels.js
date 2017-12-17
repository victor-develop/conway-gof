(function(window) {

  const mods = window.mods = window.mods || {};

  window.mods.logger = {
    info: window.console.log,
    err: window.console.log
  };

  // "Class" definitions
  const CellState = window.mods.CellState = {
    ActiveStill: 'ActiveStill',
    AliveFromDeath: 'AliveFromDeath'
  };

  const Cell = window.mods.Cell = (x, y, uid, state, overlayColor) => { 
    return { x, y, uid, state, overlayColor } 
  };

  const Board = window.mods.Board;
  const Player = window.mods.Player = (uid, color, name) => {
    return {
      uid,
      color,
      name
    }
  }

  // sample data models
  window.mods.players = [
    Player('aaa', '#226ad6', 'Tom'),
    Player('bbb', '#f20cdb', 'Cat'),
    Player('ccc', '#0d6d06', 'Fok')
  ]

  window.mods.currentPlayer = window.mods.players[0];
  
  window.mods.game = {
    board: Board.create(20, 20, [
      Cell(0, 1, 'aaa', CellState.ActiveStill, 'red'),
      Cell(1, 1, 'aaa', CellState.ActiveStill,'blue'),
      Cell(2, 1, 'aaa', CellState.AliveFromDeath, 'green')
    ])
  }

  window.mods.tick2 = {
    board: Board.create(20, 20, [
      Cell(1, 0, 'aaa', CellState.ActiveStill, 'red'),
      Cell(1, 1, 'aaa', CellState.ActiveStill,'blue'),
      Cell(1, 2, 'aaa', CellState.AliveFromDeath, 'green')
    ])
  }

  window.mods.notices = [
    "Successfully connect",
    "New user entered the world",
    "You just contributed to the world!",
    "You contribution was skipped due to network latency",
    "Some cells has goned beyond the view window. You might not be able to see them"
  ]
})(window)