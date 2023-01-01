import { Component, Input } from "@angular/core";
import { GraphService } from "../core/graph.service";
import { Customer } from "./customer";

@Component({
    template: ``
})
export abstract class RelatedDataComponent {
    data: any[] = [];

    private _selectedCustomer: Customer | null = null;
    @Input() get selectedCustomer(): Customer | null {
      return this._selectedCustomer;
    }
  
    set selectedCustomer(customer: Customer | null) {
      this._selectedCustomer = customer;
      if (customer) {
        this.search(customer.name);
      }
    }

    abstract search(query: string) : Promise<any>;
  
    constructor(public graphService: GraphService) {}
}