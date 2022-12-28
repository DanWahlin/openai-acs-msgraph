import { Component, OnInit } from '@angular/core';
import { Providers, Msal2Provider } from '@microsoft/mgt';
import { GraphService } from './core/graph.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-mgt';
  name = '';

  constructor(private graphService: GraphService) {}

  async ngOnInit() {
    this.graphService.init();
  }

  userLoggedIn(e: any) {
      this.name = e.displayName;
  }
}
