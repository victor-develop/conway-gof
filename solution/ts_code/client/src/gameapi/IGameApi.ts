import IPos from '../../../common/src/gamemodels/ipos'
import IResponse from '../../../common/src/api/IResponse'
import { IEventBus } from '../../../common/src/ievent-bus'
import { IPlayerProfile } from '../../../common/src/api/i-player-profile'


export interface IGameApi extends IEventBus {
  connect: () => Promise<IResponse>
  currentPlayer: {
    submitProfile: (profile: IPlayerProfile) => any,
  }
  cells: {
    patch: (positions: IPos[]) => any,
  }
}
