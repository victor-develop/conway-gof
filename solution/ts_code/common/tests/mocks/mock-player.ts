
import { Color } from '../../src/gamemodels/color'
import IPlayer from '../../src/gamemodels/iplayer'

export default function createPlayer(uid: string, name: string, color: Color): IPlayer {
  return {
    uid,
    name,
    color,
  }
}
