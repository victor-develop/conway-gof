(function(window) {

  const mods = window.mods = window.mods || {};

  window.mods.logger = {
    info: window.console.log,
    err: window.console.log
  };

  const CellState = window.mods.CellState = {
    ActiveStill: 'ActiveStill',
    AliveFromDeath: 'AliveFromDeath'
  };

  // "Class" definitions
  const Cell = window.mods.Cell = (x, y, uid, state, overlayColor) => { 
    return { x, y, uid, state, overlayColor } 
  };

  const Board = window.mods.Board = (width, height, cells) => {

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
    board: Board(20, 20, [
      Cell(0, 1, 'aaa', CellState.ActiveStill, 'red'),
      Cell(1, 1, 'aaa', CellState.ActiveStill,'blue'),
      Cell(2, 1, 'aaa', CellState.AliveFromDeath, 'green')
    ])
  }

  window.mods.tick2 = {
    board: Board(20, 20, [
      Cell(1, 0, 'aaa', CellState.ActiveStill, 'red'),
      Cell(1, 1, 'aaa', CellState.ActiveStill,'blue'),
      Cell(1, 2, 'aaa', CellState.AliveFromDeath, 'green')
    ])
  }
})(window)