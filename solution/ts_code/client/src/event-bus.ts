import { logEventBus } from '../../common/src/log-event-bus'
import { EventEmitter } from 'eventemitter3'
import { IEventBus } from '../../common/src/ievent-bus'
import { ILogger } from '../../common/src/services'

export function createEventBus(logger: ILogger): IEventBus {
  return logEventBus(logger, new EventEmitter())
}
