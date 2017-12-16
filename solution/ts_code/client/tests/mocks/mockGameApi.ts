import { IGameApi } from '../../src/gameapi/IGameApi'
import IResponse from '../../../common/src/api/IResponse'
import IPos from '../../../common/src/gamemodels/ipos'
import { ILogger } from '../../../common/src/services'
import { IEventBus } from '../../src/ievent-bus'
import { apiEvents } from '../../../common/src/api/api-events'
import { mockGameState } from '../../../client/tests/mocks/mockGameState'
import IErrorResponse from '../../../common/src/api/IErrorResponse'

function response(uploadedData: any): IResponse {
  return {
    messages: ['success'],
    success: true,
    data: uploadedData,
  }
}


const emptyResponse = response({})

const failCellPatch: IErrorResponse = {
  messages:['fail patch intentionally'],
  errors: [],
}

export const mockGameApiResponse = {
  emptyResponse,
  failCellPatch,
}

export interface mockGameApiCallbacks {
  patchCallback: (positions: IPos[]) => void
}

const emptyCallbacks: mockGameApiCallbacks = {
  patchCallback: null,
}

export const mockGameApi = function(
  logger: ILogger,
  eventBus: IEventBus,
  callbacks: mockGameApiCallbacks = emptyCallbacks) :IGameApi {

  return {
    on: (...args: any[]) => eventBus.on.apply(eventBus, args),
    emit: (...args: any[]) => eventBus.emit.apply(eventBus,args),
    connect: () => Promise.resolve(emptyResponse),
    cells: {
      patch: (positions: IPos[]) => {
        if (callbacks.patchCallback) {
          callbacks.patchCallback(positions)
        }
        return Promise.resolve(response(positions))
      },
    },
  }
}
