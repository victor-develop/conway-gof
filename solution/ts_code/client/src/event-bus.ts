import { EventEmitter } from 'eventemitter3'
import { IEventBus } from '../../common/src/ievent-bus'

export function createEventBus(): IEventBus {
  return new EventEmitter()
}
