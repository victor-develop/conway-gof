import { IGameApi } from '../../src/gameapi/IGameApi'
import IResponse from '../../../common/src/api/IResponse'
import IPos from '../../../common/src/gamemodels/ipos'
import { ILogger } from '../../../common/src/services'
import { IEventBus } from '../../../common/src/ievent-bus'
import { apiEvents } from '../../../common/src/api/api-events'
import IErrorResponse from '../../../common/src/api/IErrorResponse'
import { IPlayerProfile } from '../../../common/src/api/i-player-profile'

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
  submitProfileCallback: (profile: IPlayerProfile) => any
}

const emptyCallbacks: mockGameApiCallbacks = {
  patchCallback: null,
  submitProfileCallback: null,
}

export const mockGameApi = function(
  logger: ILogger,
  eventBus: IEventBus,
  callbacks: mockGameApiCallbacks = emptyCallbacks) :IGameApi {

  return {
    on: (...args: any[]) => eventBus.on.apply(eventBus, args),
    emit: (...args: any[]) => eventBus.emit.apply(eventBus,args),
    connect: () => Promise.resolve(emptyResponse),
    currentPlayer: {
      submitProfile: (profile: IPlayerProfile) => {
        if (callbacks.submitProfileCallback) {
          callbacks.submitProfileCallback(profile)
        }
      },
    },
    cells: {
      patch: (positions: IPos[]) => {
        if (callbacks.patchCallback) {
          callbacks.patchCallback(positions)
        }
        return Promise.resolve(response(positions))
      },
    },
    disconnect() {
      return
    },
  }
}
