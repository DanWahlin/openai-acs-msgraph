export interface DialogBase {
  title: string;
  body: string;
  toPhone?: string;
  mode?: DialogMode;
  action?: (message: string, data: any) => any
}

export interface TeamsDialogData extends DialogBase {
  id: string,
  teamId: string,
  channelId: string,
  webUrl: string
}

export enum DialogMode {
  Default,
  EmailSms
}