import IGameState from '../../src/game-state'
import { presetPatterns } from '../../../common/src/gamemodels/preset-pattern'
import { Board } from '../../../common/src/gamemodels/board'
import { ILogger } from '../../../common/src/services'
import createPlayer from '../../../common/tests/mocks/mock-player'

const w = 60
const h = 100

export function mockGameState(logger: ILogger): IGameState {
  return {
    updateAt: 1513368397117,
    board: Board.create(w, h, presetPatterns[1]),
    players: [],
  }
}

export const mockGameStates = {
  boardOnly: {
    updateAt: 1513368397117,
    board: Board.create(w, h, presetPatterns[1]),
  },
  playersOnly: {
    updateAt: 1513368397117,
    players: [
      createPlayer('aaa', '#226ad6', 'Tom'),
      createPlayer('bbb', '#f20cdb', 'Cat'),
      createPlayer('ccc', '#0d6d06', 'Fok'),
    ],
  },
}
