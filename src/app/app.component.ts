import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Providers, ProviderState } from '@microsoft/mgt';
import { GraphService } from './core/graph.service';
import { Customer } from './shared/customer';
import { PEOPLE_ICON, FILE_ICON, CHAT_ICON, EMAIL_ICON, AGENDA_ICON, PHONE_ICON, CONTENT_ICON, SEARCH_ICON, RESET_ICON } from './shared/svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-mgt';
  get loggedIn() {
    if (Providers.globalProvider) {
      return Providers.globalProvider.state === ProviderState.SignedIn;
    }
    return false;
  }
  name = '';
  selectedCustomer: Customer | null = null;

  constructor(private graphService: GraphService, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    this.iconRegistry.addSvgIconLiteral('people', this.sanitizer.bypassSecurityTrustHtml(PEOPLE_ICON));
    this.iconRegistry.addSvgIconLiteral('file', this.sanitizer.bypassSecurityTrustHtml(FILE_ICON));
    this.iconRegistry.addSvgIconLiteral('chat', this.sanitizer.bypassSecurityTrustHtml(CHAT_ICON));
    this.iconRegistry.addSvgIconLiteral('email', this.sanitizer.bypassSecurityTrustHtml(EMAIL_ICON));
    this.iconRegistry.addSvgIconLiteral('agenda', this.sanitizer.bypassSecurityTrustHtml(AGENDA_ICON));
    this.iconRegistry.addSvgIconLiteral('phone', this.sanitizer.bypassSecurityTrustHtml(PHONE_ICON));
    this.iconRegistry.addSvgIconLiteral('content', this.sanitizer.bypassSecurityTrustHtml(CONTENT_ICON));
    this.iconRegistry.addSvgIconLiteral('search', this.sanitizer.bypassSecurityTrustHtml(SEARCH_ICON));
    this.iconRegistry.addSvgIconLiteral('reset', this.sanitizer.bypassSecurityTrustHtml(RESET_ICON));
    this.graphService.init();
  }

  customerSelected(customer: Customer) {
    this.selectedCustomer = customer;
  }

  userLoggedIn(e: any) {
    this.name = e.displayName;
  }
}
