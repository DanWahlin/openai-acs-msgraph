import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBase, DialogMode, TeamsDialogData } from './dialog-data';

@Component({
  selector: 'app-textarea-dialog',
  templateUrl: './textarea-dialog.component.html',
  styleUrls: ['./textarea-dialog.component.scss']
})
export class TextAreaDialogComponent<T extends DialogBase> {
  mode: DialogMode = DialogMode.Default;
  DialogMode = DialogMode;
  title = '';
  message = '';
  initialMessage = '';
  toPhone = '';

  constructor(
    public dialogRef: MatDialogRef<TextAreaDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: T) {}

  ngOnInit() {
    this.mode = this.data.mode || DialogMode.Default;
    this.title = this.data instanceof Error ? '' : this.data.title;
    this.message = this.data instanceof Error ? '' : this.data.body;
  }

  async send() {
    this.data = await this.data.action!(this.message, this.data);
    this.dialogRef.close(this.data);
  }

  async generateMessage() {

  }

  async sendEmail() {

  }

  async sendSMS() {

  }

}
