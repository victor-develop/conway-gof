import { ILogger } from './services'
import { IEventBus } from './ievent-bus'

export function logEventBus(logger: ILogger, eventBus: IEventBus): IEventBus {
  const attachedBus: IEventBus = {
    on: (eventKey, callback) => {
      logger.info({ eventKey }, 'event mounted on ' + Date.now())
      eventBus.on(eventKey, callback)
    },
    emit: (eventKey: string, ...args) => {
      logger.info({ eventKey, args }, 'event emitted ' + Date.now())
      eventBus.emit(eventKey, ...args)
    },
  }
  return attachedBus
}
