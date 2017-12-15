import { IGameApi } from '../../src/gameapi/IGameApi'
import IResponse from '../../../common/src/api/IResponse'
import IPos from '../../../common/src/gamemodels/ipos'
import { ILogger } from '../../../common/src/services'
import { IEventBus } from '../../src/ievent-bus'
import { apiEvents } from '../../../common/src/api/api-events'
import { mockGameState } from '../../../client/tests/mocks/mockGameState'

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
    connect: () => {
      eventBus.emit(apiEvents.IGameStateUpdate, mockGameState(logger))
      return <any>Promise.resolve(response)
    },
    cells: {
      patch: (positions: IPos[]) => Promise.resolve(response),
    },
  }
}
