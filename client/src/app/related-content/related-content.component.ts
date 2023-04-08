import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Customer } from '../shared/interfaces';

@Component({
  selector: 'app-related-content',
  templateUrl: './related-content.component.html',
  styleUrls: ['./related-content.component.scss']
})
export class RelatedContentComponent implements OnInit {

  private _selectedCustomer: Customer | null = null;
  @Input()
  get selectedCustomer(): Customer | null {
    return this._selectedCustomer;
  }
  set selectedCustomer(value: Customer | null) {
    this._selectedCustomer = value;
    if (value) {
      this.selectedQueryText = value.company;
    }
  }

  selectedQueryText = '';

  contentCounts: any = {
    files: 0,
    emails: 0,
    chats: 0,
    agendaEvents: 0
  };

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) { }

  ngOnInit() {

  }

  filter(data: string) {
    this.selectedQueryText = data.trim();
  }

  dataLoaded(type: string, data: any) {
    this.contentCounts[type] = data.length;
  }

}
