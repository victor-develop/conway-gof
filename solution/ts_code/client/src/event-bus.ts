import { EventEmitter } from 'eventemitter3'
import { IEventBus } from './ievent-bus'

export function createEventBus(): IEventBus {
  return new EventEmitter()
}
