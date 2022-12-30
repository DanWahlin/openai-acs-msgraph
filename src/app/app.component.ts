import { Component, OnInit } from '@angular/core';
import { Providers, Msal2Provider } from '@microsoft/mgt';
import { DataService } from './core/data.service';
import { GraphService } from './core/graph.service';
import { Customer } from './shared/customer';

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

  constructor(private graphService: GraphService, private dataService: DataService) {}

  async ngOnInit() {
    this.graphService.init();
    this.dataService.getCustomers()
    .subscribe((customers: Customer[]) => this.customers = customers);
  }

  customerSelected(customer: Customer) {
    this.selectedCustomer = customer;
  }

  userLoggedIn(e: any) {
    this.loggedIn = true;
    this.name = e.displayName;
  }
}
