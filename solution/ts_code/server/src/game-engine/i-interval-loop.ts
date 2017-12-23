/**
 * abstraction of a interval-based loop
 */
export interface IIntervalLoop {
  start: Function,
  stop: Function
}

/**
 * This is supposed to act the same way as setInterval() does,
 * i.e. to run an operation periodically, but with a start()
 * and stop() to be controlled
 * 
 * The reason to abstract the setInterval() with this interface is that
 * by doing soyou can create a faked implementation to manually 
 * controll the interval loop for debug/testing purpose
 * 
 * @param loopOperation - operation to be executed every interval
 * @param intervalMilleSeconds - milleseconds as interval
 * 
 * @returns IIntervalLoop
 */
export type IIntervalLoopSetter =
  (loopOperation:() => any, intervalMilleSeconds: number) => IIntervalLoop

