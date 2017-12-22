import { Board } from '../../../common/src/gamemodels/board'
import { ILogger } from '../../../common/src/services'
import createPlayer from '../../../common/tests/mocks/mock-player'
import createCell from '../../../common/src/gamemodels/cell'
import { CellState } from '../../../common/src/gamemodels/cell-state'
import GameBoard from '../../../common/src/gamemodels/game-board'
import { IGameState } from '../../../common/src/gamemodels/i-game-state'

const w = 80
const h = 60


const players = [
  createPlayer('Tom', '#226ad6', 'Tom'),
  createPlayer('Jack', '#f20cdb', 'Cat'),
  createPlayer('Lam', '#0d6d06', 'Fok'),
]

// I have no idea why ts-lint complains the 3rd components in the array
// so I just disable the rule in the following code

const gameTick1 = {
  board: GameBoard.create(w, h, [
    createCell(0, 1, 'aaa', CellState.AliveStill, 'red'),
    createCell(1, 1, 'aaa', CellState.AliveStill,'blue'),
    // tslint:disable-next-line:no-magic-numbers
    createCell(2, 1, 'aaa', CellState.AliveFromDeath, 'green'),
  ]),
}

const gameTick2 = {
  board: GameBoard.create(w, h, [
    createCell(1, 0, 'aaa', CellState.AliveStill, 'red'),
    createCell(1, 1, 'aaa', CellState.AliveStill,'blue'),
    // tslint:disable-next-line:no-magic-numbers
    createCell(1, 2, 'aaa', CellState.AliveFromDeath, 'green'),
  ]),
}

const fullState: IGameState = {
  updateAt: 1513368397117,
  board: gameTick1.board,
  players,
}

export const mockGameStates = {
  playersOnly: {
    updateAt: 1513368397117,
    players,
  },
  full: fullState,
  gameTick1,
  gameTick2,
}
