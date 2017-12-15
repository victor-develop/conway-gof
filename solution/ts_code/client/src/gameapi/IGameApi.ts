import IPos from '../../../common/src/gamemodels/ipos'
import IResponse from '../../../common/src/api/IResponse'
import { IEventBus } from '../ievent-bus'


export interface IGameApi extends IEventBus {
  connect: () => Promise<IResponse>
  cells: {
    patch: (positions: IPos[]) => Promise<IResponse>,
  }
}
