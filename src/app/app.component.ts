import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from './core/data.service';
import { GraphService } from './core/graph.service';
import { Customer } from './shared/customer';

const FILE_ICON = 
`
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
`;

const CHAT_ICON =
  `
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 4h16v12H5.17L4 17.17V4m0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm2 10h8v2H6v-2zm0-3h12v2H6V9zm0-3h12v2H6V6z"/></svg>
`;

const EMAIL_ICON = 
`
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>
`;

const AGENDA_ICON = 
`
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/></svg>
`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-mgt';
  loggedIn = false;
  name = '';
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;

  constructor(private graphService: GraphService, private dataService: DataService, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    this.graphService.init();
    this.dataService.getCustomers().subscribe((customers: Customer[]) => this.customers = customers);
    this.iconRegistry.addSvgIconLiteral('file', this.sanitizer.bypassSecurityTrustHtml(FILE_ICON));
    this.iconRegistry.addSvgIconLiteral('chat', this.sanitizer.bypassSecurityTrustHtml(CHAT_ICON));
    this.iconRegistry.addSvgIconLiteral('email', this.sanitizer.bypassSecurityTrustHtml(EMAIL_ICON));
    this.iconRegistry.addSvgIconLiteral('agenda', this.sanitizer.bypassSecurityTrustHtml(AGENDA_ICON));
  }

  customerSelected(customer: Customer) {
    this.selectedCustomer = customer;
  }

  userLoggedIn(e: any) {
    this.loggedIn = true;
    this.name = e.displayName;
  }
}
