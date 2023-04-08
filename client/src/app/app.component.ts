import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FeatureFlagsService } from './core/feature-flags.service';
import { GraphService } from './core/graph.service';
import { Customer } from './shared/interfaces';
import { PEOPLE_ICON, FILE_ICON, CHAT_ICON, EMAIL_ICON, AGENDA_ICON, PHONE_ICON, CONTENT_ICON, SEARCH_ICON, RESET_ICON, CONTACT_ICON, SMS_ICON } from './shared/svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  get loggedIn() {
    return this.graphService.loggedIn();
  }
  name = '';
  signInMessage = '';
  selectedCustomer: Customer | null = null;
  timer: NodeJS.Timeout | null = null;

  constructor(private graphService: GraphService, private iconRegistry: MatIconRegistry, 
    private sanitizer: DomSanitizer, public featureFlags: FeatureFlagsService) { }

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
    this.iconRegistry.addSvgIconLiteral('contact', this.sanitizer.bypassSecurityTrustHtml(CONTACT_ICON));
    this.iconRegistry.addSvgIconLiteral('sms', this.sanitizer.bypassSecurityTrustHtml(SMS_ICON));
    this.graphService.init();

    // Update the signInMessage property after 800ms
    // Option 1: of('Please sign in to continue').pipe(delay(800)).subscribe((msg: string) => this.signInMessage = msg);
    // Option 2 (yes...opting for simplicity):
    this.timer = setTimeout(() => this.signInMessage = 'Please sign in to continue', 800);
  }

  customerSelected(customer: Customer) {
    this.selectedCustomer = { ...customer };
  }

  userLoggedIn(user: { displayName: string}) {
    this.name = user.displayName;
  }

  ngOnDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
