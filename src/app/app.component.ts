import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from './core/data.service';
import { GraphService } from './core/graph.service';
import { Customer } from './shared/customer';
import { ProviderState } from '@microsoft/mgt';
import { PEOPLE_ICON, FILE_ICON, CHAT_ICON, EMAIL_ICON, AGENDA_ICON } from './shared/svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-mgt';
  loggedIn = ProviderState.SignedIn;
  name = '';
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;

  constructor(private graphService: GraphService, private dataService: DataService, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    this.iconRegistry.addSvgIconLiteral('people', this.sanitizer.bypassSecurityTrustHtml(PEOPLE_ICON));
    this.iconRegistry.addSvgIconLiteral('file', this.sanitizer.bypassSecurityTrustHtml(FILE_ICON));
    this.iconRegistry.addSvgIconLiteral('chat', this.sanitizer.bypassSecurityTrustHtml(CHAT_ICON));
    this.iconRegistry.addSvgIconLiteral('email', this.sanitizer.bypassSecurityTrustHtml(EMAIL_ICON));
    this.iconRegistry.addSvgIconLiteral('agenda', this.sanitizer.bypassSecurityTrustHtml(AGENDA_ICON));
    this.graphService.init();
    this.dataService.getCustomers().subscribe((customers: Customer[]) => this.customers = customers);
  }

  customerSelected(customer: Customer) {
    this.selectedCustomer = customer;
  }

  userLoggedIn(e: any) {
    this.name = e.displayName;
  }
}
