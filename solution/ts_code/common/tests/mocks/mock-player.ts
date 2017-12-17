
import { Color } from '../../src/gamemodels/color'
import IPlayer from '../../src/gamemodels/iplayer'

export default function createPlayer(name: string, color: string, uid: Color): IPlayer {
  return {
    uid,
    name,
    color,
  }
}
