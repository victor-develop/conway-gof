import { IGameApi } from '../../src/gameapi/IGameApi'
import IResponse from '../../../common/src/api/IResponse'
import IPos from '../../../common/src/gamemodels/ipos'
import { ILogger } from '../../../common/src/services'
import { IEventBus } from '../../src/ievent-bus'

export const mockGameApi = function(logger: ILogger, eventBus: IEventBus) :IGameApi {
  const response: IResponse = {
    messages: ['success'],
    success: true,
    errors: [],
    data: {

    },
  }
  return {
    on: eventBus.on,
    emit: eventBus.emit,
    connect: () => <any>Promise.resolve(response),
    cells: {
      patch: (positions: IPos[]) => Promise.resolve(response),
    },
  }
}
