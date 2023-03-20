export interface DialogBase {
  title: string;
  body: string;
  toPhone?: string;
  action?: (message: string, data: any) => any
}

export interface TeamsDialogData extends DialogBase {
  id: string,
  teamId: string,
  channelId: string,
  webUrl: string
}