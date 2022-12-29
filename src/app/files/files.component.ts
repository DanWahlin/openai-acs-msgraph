import { Component, Input, OnInit } from '@angular/core';
import { GraphService } from 'src/app/core/graph.service';
import { Customer } from '../shared/customer';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  files: any[] = [];

  private _selectedCustomer: Customer | null = null;
  @Input() get selectedCustomer(): Customer | null {
    return this._selectedCustomer;
  }

  set selectedCustomer(customer: Customer | null) {
    this._selectedCustomer = customer;
    if (customer) {
      this.searchFiles(customer);
    }
  }

  constructor(private graphService: GraphService) {}

  ngOnInit() { }

  async searchFiles(customer: Customer) {
    this.files = await this.graphService.searchFiles(customer.name);
  }

  itemClick(e: any) {
    window.open(e.detail.webUrl, '_blank');
  }
}
