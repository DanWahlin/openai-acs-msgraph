import { Component, inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RelatedContentBaseComponent } from '../shared/related-content-base.component';
import { TeamsDialogData } from '../textarea-dialog/dialog-data';
import { TextAreaDialogComponent } from '../textarea-dialog/textarea-dialog.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent extends RelatedContentBaseComponent implements OnDestroy {
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

  openDialog() {
    this.dialogData.message = this.searchText;
    const dialogRef = this.dialog.open(TextAreaDialogComponent, {
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
