import { Component, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Customer } from '../shared/interfaces';

type ContentCounts = {
  files: number;
  emails: number;
  chats: number;
  agendaEvents: number;
};

type ContentCountType = keyof ContentCounts;

@Component({
  selector: 'app-related-content',
  templateUrl: './related-content.component.html',
  styleUrls: ['./related-content.component.scss']
})
export class RelatedContentComponent {

  closed = true;
  selectedQueryText = '';
  contentCounts: ContentCounts = {
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

  dataLoaded(type: ContentCountType, data: unknown[]) {
    this.contentCounts[type] = data.length;
  }

  closeCard() {
    this.closed = true;
  }

}