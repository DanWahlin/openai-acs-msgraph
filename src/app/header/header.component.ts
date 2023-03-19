import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Providers } from '@microsoft/mgt';
import { EventBusService, Events } from '../core/eventbus.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() userLoggedIn = new EventEmitter();
  callVisible = false;
  callData: any;

  constructor(private eventBus: EventBusService) { }

  ngOnInit() {
    this.eventBus.on(Events.CustomerCall, (data: any) => {
      this.callVisible = true;
      this.callData = data;
    });
  }

  async loginCompleted(e: any) {
    const me = await Providers.globalProvider.graph.client.api('me').get();
    this.userLoggedIn.emit(me);
  }

  hangup() {
    this.callVisible = false;
  }

}
