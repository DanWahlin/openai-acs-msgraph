export interface DialogData {
  id: string,
  teamId: string,
  channelId: string,
  body: string,
  webUrl: string,
  title: string,
  action?: (message: string) => Promise<any>
}