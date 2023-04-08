import { Component, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Customer } from '../shared/interfaces';

@Component({
  selector: 'app-related-content',
  templateUrl: './related-content.component.html',
  styleUrls: ['./related-content.component.scss']
})
export class RelatedContentComponent {

  closed = true;
  selectedQueryText = '';
  contentCounts: any = {
    files: 0,
    emails: 0,
    chats: 0,
    agendaEvents: 0
  };

  customer: Customer | null = null;
  @Input()
  set selectedCustomer(value: Customer | null) {
    this.customer = value;
    this.closed = false;
    if (value) {
      this.selectedQueryText = value.company;
    }
  }

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { }

  filter(data: string) {
    this.selectedQueryText = data.trim();
  }

  dataLoaded(type: string, data: any) {
    this.contentCounts[type] = data.length;
  }

  closeCard() {
    this.closed = true;
  }

}
