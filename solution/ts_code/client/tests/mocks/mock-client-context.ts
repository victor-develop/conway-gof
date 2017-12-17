import createPlayer from '../../../common/tests/mocks/mock-player'
import { ClientContext } from '../../src/client-state'

const defaultContext: ClientContext = {
  currentPlayer: createPlayer('aaa', '#226ad6', 'Tom'),
}

export const clientContext = {
  default: defaultContext,
}
