import { Color } from '../../../common/src/gamemodels/color'
import IPlayer from '../../../common/src/gamemodels/iplayer'
import * as tinycolor from 'tinycolor2'

export class ColorUtil {
  public static assignNew(players: IPlayer[]): Color {
    const existeds = players.map(p => p.color)
    let color: Color
    do {
      color = tinycolor.random().toHex8String()
    } while (existeds.filter(existed => existed === color))
    return color
  }
}
