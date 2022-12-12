import { Component, OnInit } from '@angular/core';
import { Providers, Msal2Provider } from '@microsoft/mgt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-mgt';
  name = '';

  ngOnInit() {
      Providers.globalProvider = new Msal2Provider({
          clientId: ''
      });
  }

  userLoggedIn(e: any) {
      console.log(e);
      this.name = e.displayName;
  }
}
