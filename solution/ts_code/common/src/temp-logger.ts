import ILogger from './ilogger'
import IChildable from './ichildable'

const log = console.log

/**
 * Stop using it when starting develop backend service
 */
export default class TempLogger implements ILogger, IChildable<TempLogger> {

  private log
  private identifier

  constructor(identifier) {
    this.identifier = identifier
    this.log = log
  }

  child(identifier): Promise<TempLogger> {
    const childIdentifier = {
      parent: this.identifier,
      self: identifier,
    }
    return Promise.resolve(new TempLogger(childIdentifier))
  }

  info(obj: any) {
    this.log(obj)
  }

  err(obj: any, message: string): void {
    this.log(obj)
    this.log(message)
  }
}
