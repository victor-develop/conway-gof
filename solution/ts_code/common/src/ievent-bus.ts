export interface IEventBus {
  emit: (eventKey: string, ...args) => any
  on: (eventKey: string, callback) => any
}
