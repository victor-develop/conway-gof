export interface INotice {
  alert(msg: string): void
  notice(msg: string): void
  confirm(msg: string): Promise<boolean>
}
