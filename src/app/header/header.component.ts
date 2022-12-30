import { Component, EventEmitter, Output } from '@angular/core';
import { Providers } from '@microsoft/mgt';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() userLoggedIn = new EventEmitter();

  async loginCompleted(e: any) {
    const me = await Providers.globalProvider.graph.client.api('me').get();
    this.userLoggedIn.emit(me);
  }

}
