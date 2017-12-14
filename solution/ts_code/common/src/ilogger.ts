interface ILogger {
  info(obj: any): void
  err(obj:any, message: string): void
}

export default ILogger
