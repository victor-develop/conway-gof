/**
 * A front-end component used to notify user immediately
 * For messages that are valid in only very short time for the user
 */
export interface INotice {
  notice(msg: string | string[]): void
}
