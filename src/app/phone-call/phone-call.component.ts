import { Component, Input, OnInit } from '@angular/core';
import { CallClient, CallAgent, Call } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

declare const ACS_PHONE_NUMBER: string;

@Component({
  selector: 'app-phone-call',
  templateUrl: './phone-call.component.html',
  styleUrls: ['./phone-call.component.scss']
})
export class PhoneCallComponent implements OnInit {
  inCall = false;
  call = {} as Call;
  callAgent = {} as CallAgent;
  fromNumber = ACS_PHONE_NUMBER; // From .env file

  @Input() customerPhoneNumber = '';

  async ngOnInit() {
    const callClient = new CallClient();
    const tokenCredential = new AzureCommunicationTokenCredential('eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmE4Y2E5MGRlLWU5ZTItNDdmYS04NDkzLTM5NjZhN2ZmMTNlN18wMDAwMDAxNy05NjI2LTkzOGUtZjQwZi0zNDNhMGQwMDE0MzYiLCJzY3AiOjE3OTIsImNzaSI6IjE2NzkxNjg5NTgiLCJleHAiOjE2NzkyNTUzNTgsInJnbiI6ImFtZXIiLCJhY3NTY29wZSI6InZvaXAiLCJyZXNvdXJjZUlkIjoiYThjYTkwZGUtZTllMi00N2ZhLTg0OTMtMzk2NmE3ZmYxM2U3IiwicmVzb3VyY2VMb2NhdGlvbiI6InVuaXRlZHN0YXRlcyIsImlhdCI6MTY3OTE2ODk1OH0.UJujHddQrkn8gimlOdPoU69hKgT9XvX9dc1-77T381JKLpsbWoSPfgQyWPbJyX6dQ2ohbEGskcQYlSMHgIWSp2mRAWpD48lnThCsDn7sMieVwjn0LBXg0--Zov5gxHR2rzNVtiOARz7BRrnUIRSfZaPoYnUEMpq5qte1xEvMNju-isV8uSTca8IWrd430xygmc90BPfxIKqQ0JF_yTIFpregohEThMbTuRW97W5JnyqflygqGmVE0XNLIv4Z8jGGPjXOsxlK0J6y-Cz7xymavrRgFkkW0je7Z47_6LLU324VwoiA22XQYkJOoZpMh_orDySpEaWzqCgIoKAkMKqgxQ');
    this.callAgent = await callClient.createCallAgent(tokenCredential);
  }

  startCall() {
    this.call = this.callAgent.startCall(
      [{ phoneNumber: this.customerPhoneNumber }], {
        alternateCallerId: { phoneNumber: this.fromNumber }
    });
    console.log('Calling: ', this.customerPhoneNumber);
    console.log('Call id: ', this.call.id);
    this.inCall = true;
  }

  endCall() {
    this.call.hangUp({ forEveryone: true });
    this.inCall = false;
  }
}
