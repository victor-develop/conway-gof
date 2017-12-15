import { IGameApi } from '../../src/gameapi/IGameApi'
import IResponse from '../../../common/src/api/IResponse'
import IPos from '../../../common/src/gamemodels/ipos'
import { ILogger } from '../../../common/src/services'

export const mockGameApi = function(logger: ILogger) :IGameApi {
  const response: IResponse = {
    messages: ['success'],
    success: true,
    errors: [],
    data: {

    },
  }
  return {
    $on: (eventKey, callback) => logger.info(`${eventKey} is being listened`),
    $emit: null,
    connect: () => <any>Promise.resolve(response),
    cells: {
      patch: (positions: IPos[]) => Promise.resolve(response),
    },
  }
}

