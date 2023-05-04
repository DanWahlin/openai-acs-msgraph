import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DataService } from 'src/app/core/data.service';
import { DialogBase, TeamsDialogData } from './dialog-data';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-textarea-dialog',
    templateUrl: './textarea-dialog.component.html',
    styleUrls: ['./textarea-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatIconModule, FormsModule, MatButtonModule]
})
export class TextAreaDialogComponent implements OnInit {
  title = '';
  message = '';
  initialMessage = '';

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<TextAreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogBase | TeamsDialogData) {}

  ngOnInit() {
    this.title = this.data instanceof Error ? '' : this.data.title;
    this.message = this.data instanceof Error ? '' : this.data.message;
  }

  async send() {
    if (this.data.action) {
      this.data = await this.data.action(this.message);
      this.dialogRef.close(this.data);
    }
  }

}
