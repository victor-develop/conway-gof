import { IGameApi } from '../../src/gameapi/IGameApi'
import IResponse from '../../../common/src/api/IResponse'
import IPos from '../../../common/src/gamemodels/ipos'
import { ILogger } from '../../../common/src/services'
import { IEventBus } from '../../src/ievent-bus'
import { apiEvents } from '../../../common/src/api/api-events'
import { mockGameState } from '../../../client/tests/mocks/mockGameState'

function response(uploadedData: any): IResponse {
  return {
    messages: ['success'],
    success: true,
    errors: [],
    data: uploadedData,
  }
}

export const mockGameApi = function(logger: ILogger, eventBus: IEventBus) :IGameApi {

  const emptyResponse = response({})

  return {
    on: (...args: any[]) => eventBus.on.apply(eventBus, args),
    emit: (...args: any[]) => eventBus.emit.apply(eventBus,args),
    connect: () => Promise.resolve(emptyResponse),
    cells: {
      patch: (positions: IPos[]) => Promise.resolve(response(positions)),
    },
  }
}
