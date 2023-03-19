import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CallClient, CallAgent, Call } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { DataService } from '../core/data.service';

declare const ACS_PHONE_NUMBER: string;

@Component({
  selector: 'app-phone-call',
  templateUrl: './phone-call.component.html',
  styleUrls: ['./phone-call.component.scss']
})
export class PhoneCallComponent implements OnInit {
  inCall = false;
  call: Call | undefined;
  callAgent: CallAgent | undefined;
  fromNumber = ACS_PHONE_NUMBER; // From .env file

  @Input() customerPhoneNumber = '';
  @Output() hangup = new EventEmitter();

  constructor(private dataService: DataService) { }

  async ngOnInit() {
    this.dataService.getAcsToken().subscribe(async (user: any) => {
      const callClient = new CallClient();
      const tokenCredential = new AzureCommunicationTokenCredential(user.token);
      this.callAgent = await callClient.createCallAgent(tokenCredential);
    });

  }

  startCall() {
    this.call = this.callAgent?.startCall(
      [{ phoneNumber: this.customerPhoneNumber }], {
        alternateCallerId: { phoneNumber: this.fromNumber }
    });
    console.log('Calling: ', this.customerPhoneNumber);
    console.log('Call id: ', this.call?.id);
    this.inCall = true;
  }

  endCall() {
    if (this.call) {
      this.call.hangUp({ forEveryone: true });
      this.call = undefined;
      this.inCall = false;
    }
    else {
      this.hangup.emit();
    }
  }
}
