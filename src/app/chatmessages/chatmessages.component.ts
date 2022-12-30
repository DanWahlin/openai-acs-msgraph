import { Component, Input, OnInit } from '@angular/core';
import { GraphService } from '../core/graph.service';
import { Customer } from '../shared/customer';

@Component({
  selector: 'app-chatmessages',
  templateUrl: './chatmessages.component.html',
  styleUrls: ['./chatmessages.component.scss']
})
export class ChatmessagesComponent implements OnInit {
  chatMessages: any[] = [];

  private _selectedCustomer: Customer | null = null;
  @Input() get selectedCustomer(): Customer | null {
    return this._selectedCustomer;
  }

  set selectedCustomer(customer: Customer | null) {
    this._selectedCustomer = customer;
    if (customer) {
      this.searchChats(customer);
    }
  }

  constructor(private graphService: GraphService) {}

  ngOnInit() { }

  async searchChats(customer: Customer) {
    this.chatMessages = await this.graphService.searchChats(customer.name);
  }
}
