import Vue from 'vue'
import { IEventBus } from './ievent-bus'

export default class EventBus implements IEventBus {

  /**
   * Use Vue's event system for convenience
   */
  private event: Vue

  public $emit(...args : any[]) {
    return this.event.$emit.apply(this.event, args)
  }

  public $on(eventKey: string, callback: any) {
    return this.event.$on.apply(this.event, arguments)
  }

  constructor() {
    this.event = new Vue()
  }
}
