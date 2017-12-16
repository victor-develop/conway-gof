import { EventEmitter } from 'eventemitter3'
import { IEventBus } from './ievent-bus'

export default class EventBus
  extends EventEmitter
  implements IEventBus {

  }
