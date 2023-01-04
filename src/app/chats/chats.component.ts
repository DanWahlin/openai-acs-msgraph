import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RelatedContentBaseComponent } from '../shared/related-content-base.component';
import { ChatDialogComponent, DialogData } from './chat-dialog/chat-dialog.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent extends RelatedContentBaseComponent implements OnInit {

  dialog: MatDialog = inject(MatDialog);
  dialogData: DialogData = {
    id: '',
    teamId: '',
    channelId: '',
    body: '',
    webUrl: 'response.webUrl'
  }

  ngOnInit() {}

  openDialog() {
    this.dialogData.body = this.searchText;
    const dialogRef = this.dialog.open(ChatDialogComponent, {
      data: this.dialogData
    });

    dialogRef.afterClosed().subscribe(response => {
      console.log(`Dialog result: ${response}`);
      if (response) {
        this.dialogData = response;
        this.search(this.searchText);
      }
    });
  }

  override async search(query: string) {
    this.data = await this.graphService.searchChats(query);
  }

}
