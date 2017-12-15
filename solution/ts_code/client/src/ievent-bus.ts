export interface IEventBus {
  $emit
  $on: (eventKey: string, callback) => any
}
