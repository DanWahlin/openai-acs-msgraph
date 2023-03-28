import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { AcsService } from '../core/acs.service';
import { EmailSmsDialogData } from './email-sms-dialog-data';

declare const CUSTOMER_PHONE_NUMBER: string;

@Component({
  selector: 'app-email-sms-dialog',
  templateUrl: './email-sms-dialog.component.html',
  styleUrls: ['./email-sms-dialog.component.scss']
})
export class EmailSmsDialogComponent implements OnInit, OnDestroy {
  title = '';
  prompt = '';
  initialMessage = '';
  emailMessage = '';
  emailAddress = '';
  smsMessage = '';
  placeholder = `Example: 
Order is delayed 2 days. 
5% discount off order. 
We're sorry.`
  private subscriptions: Subscription[] = [];

  constructor(
    private dataService: DataService,
    private acsService: AcsService,
    public dialogRef: MatDialogRef<EmailSmsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmailSmsDialogData) { }

  ngOnInit() {
    this.title = this.data instanceof Error ? '' : this.data.title;
  }

  async generateEmailSmsMessages() {
    this.subscriptions.push(
      this.dataService.completeEmailSmsMessages(this.prompt, this.data.company, this.data.contactName)
        .subscribe((data) => {
          this.emailMessage = data.email;
          this.smsMessage = data.sms;
        })
    );
  }

  sendEmail() {
    this.subscriptions.push(
      this.acsService.sendEmail(this.emailMessage, this.data.email).subscribe(res => {
        console.log('Email sent:', res);
      })
    );
  }

  sendSMS() {
    this.subscriptions.push(
      this.acsService.sendSms(this.smsMessage, CUSTOMER_PHONE_NUMBER /* this.data.customerPhoneNumber */).subscribe(res => {
        console.log('SMS sent:', res);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
