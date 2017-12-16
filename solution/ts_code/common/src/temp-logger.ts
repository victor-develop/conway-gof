import ILogger from './ilogger'
import IChildable from './ichildable'

const log = console.log

/**
 * Stop using it when starting develop backend service
 */
export default class TempLogger implements ILogger, IChildable<TempLogger> {

  private log
  private identifier

  private makeLog(obj: any) {
    return {
      identifier: this.identifier,
      content: obj,
    }
  }

  constructor(identifier) {
    this.identifier = identifier
    this.log = log
    this.log(`logger of ${identifier} created`)
  }

  child(identifier): Promise<TempLogger> {
    const childIdentifier = {
      parent: this.identifier,
      self: identifier,
    }
    return Promise.resolve(new TempLogger(childIdentifier))
  }

  info(obj: any) {
    this.log(this.makeLog(obj))
  }

  err(obj: any, message: string): void {
    this.info(message)
    this.info(obj)
  }
}
