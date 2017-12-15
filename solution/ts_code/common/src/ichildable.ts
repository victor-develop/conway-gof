/**
 * Something which can spawn a child, typical use case: logger
 */
export default interface IChildable<T> {
  child(message: string): Promise<T>
}
