import createPlayer from '../../../common/tests/mocks/mock-player'
import { ClientContext } from '../../src/client-state'
import { presetPatternBoards } from '../../../common/src/gamemodels/preset-pattern'

const defaultContext: ClientContext = {
  currentPlayer: createPlayer('aaa', '#226ad6', 'Tom'),
  presetPatternBoards,
}

export const clientContext = {
  default: defaultContext,
}
