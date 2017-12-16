import IChildable from './ichildable'

interface ILogger extends IChildable<ILogger> {
  info: (obj: any, message: string) => void
  err: (obj: any, message: string) => void
}

export default ILogger
