import IPos from '../../../common/src/gamemodels/ipos'
import IResponse from '../../../common/src/api/IResponse'


export interface IGameApi {
  cells: {
    patch: (positions: IPos[]) => Promise<IResponse>,
  }
}
