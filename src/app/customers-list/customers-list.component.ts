import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Customer } from '../shared/customer';
import { SorterService } from '../core/sorter.service';
import { EventBusService } from 'src/app/core/eventbus.service';

@Component({
    selector: 'app-customers-list',
    templateUrl: './customers-list.component.html',
    styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'city', 'orderTotal', 'actions'];
    private _customers: Customer[] = [];
    @Input() get customers(): Customer[] {
        return this._customers;
    }
    set customers(value: Customer[]) {
        if (value) {
            this.filteredCustomers = this._customers = value;
        }
    }
    filteredCustomers: Customer[] = [];
    currencyCode = 'USD';
    @Output() customerSelected = new EventEmitter<Customer>();

    constructor(private sorterService: SorterService, private eventBus: EventBusService) { }

    ngOnInit() {  }

    filter(data: string) {
        if (data) {
            data = data.toLowerCase();
            this.filteredCustomers = this.customers.filter((cust: Customer) => {
                return cust.name.toLowerCase().indexOf(data) > -1 ||
                       cust.city.toLowerCase().indexOf(data) > -1 
            });
        } else {
            this.filteredCustomers = this.customers;
        }
    }

    sort(prop: string) {
        this.sorterService.sort(this.filteredCustomers, prop);
    }

    customerTrackBy(index: number, customer: Customer) {
        return customer.id;
    }

    getRelatedData(customer: Customer) {
        this.customerSelected.emit(customer);
    }   

}
