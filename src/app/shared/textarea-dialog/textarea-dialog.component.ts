import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/core/data.service';
import { DialogBase } from './dialog-data';

@Component({
  selector: 'app-textarea-dialog',
  templateUrl: './textarea-dialog.component.html',
  styleUrls: ['./textarea-dialog.component.scss']
})
export class TextAreaDialogComponent<T extends DialogBase> {
  title = '';
  message = '';
  initialMessage = '';

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<TextAreaDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: T) {}

  ngOnInit() {
    this.title = this.data instanceof Error ? '' : this.data.title;
    this.message = this.data instanceof Error ? '' : this.data.message;
  }

  async send() {
    this.data = await this.data.action!(this.message, this.data);
    this.dialogRef.close(this.data);
  }

}
