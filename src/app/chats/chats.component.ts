import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RelatedContentBaseComponent } from '../shared/related-content-base.component';
import { TeamsDialogData } from '../shared/textarea-dialog/dialog-data';
import { TextAreaDialogComponent } from '../shared/textarea-dialog/textarea-dialog.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent extends RelatedContentBaseComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  dialog: MatDialog = inject(MatDialog);
  dialogData: TeamsDialogData = {
    id: '',
    teamId: '',
    channelId: '',
    message: '',
    webUrl: 'response.webUrl',
    title: 'Send Teams Chat',
    action: this.graphService.sendTeamsChat
  }

  ngOnInit() {}

  openDialog() {
    this.dialogData.message = this.searchText;
    const dialogRef = this.dialog.open(TextAreaDialogComponent<TeamsDialogData>, {
      data: this.dialogData
    });

    this.subscription = dialogRef.afterClosed().subscribe(response => {
      console.log('Teams chat dialog result:', response);
      if (response) {
        this.dialogData = response;
        this.search(this.searchText);
      }
    });
  }

  override async search(query: string) {
    this.data = await this.graphService.searchChats(query);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
