import { Color } from '../../../common/src/gamemodels/color'
import IPlayer from '../../../common/src/gamemodels/iplayer'
import * as tinycolor from 'tinycolor2'
import GameBoard from '../../../common/src/gamemodels/game-board';
import IPos from '../../../common/src/gamemodels/ipos';

export class ColorUtil {
  public static assignNew(players: IPlayer[]): Color {
    const existeds = players.map(p => p.color)
    let color: Color
    do {
      color = tinycolor.random().toHexString()
    } while (existeds.filter(existed => existed === color).length > 0)
    return color
  }

  public static getAverage(colors: Color[]): Color {
    const tinycolors = colors.map(c => tinycolor(c).toRgb())
    if (tinycolors.length < 0) {
      return tinycolor('black').toHexString()
    }
    const average = arr => arr.reduce((value1, value2) => value1 + value2, 0) / arr.length
    const r = average(tinycolors.map(c => c.r))
    const g = average(tinycolors.map(c => c.g))
    const b = average(tinycolors.map(c => c.b))
    return tinycolor({ r, g, b }).toHexString()
  }
}
