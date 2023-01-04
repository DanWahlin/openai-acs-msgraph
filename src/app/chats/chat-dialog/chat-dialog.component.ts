import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GraphService } from 'src/app/core/graph.service';

export interface DialogData {
  id: string,
  teamId: string,
  channelId: string,
  body: string,
  webUrl: string,
}

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class ChatDialogComponent {

  message = '';
  initialMessage = '';

  constructor(
    public dialogRef: MatDialogRef<ChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private graphService: GraphService) {}

  ngOnInit() {
    this.message = this.data instanceof Error ? '' : this.data.body;
  }

  async sendTeamsChat() {
    this.data = await this.graphService.sendTeamsChat(this.message);
    this.dialogRef.close(this.data);
  }

}
