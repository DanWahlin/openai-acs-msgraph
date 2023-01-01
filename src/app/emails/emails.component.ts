import { Component, Input, OnInit } from '@angular/core';
import { RelatedDataComponent } from '../shared/related-data.component';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent extends RelatedDataComponent implements OnInit {

  ngOnInit() { }

  override async search(query: string) {
    this.data = await this.graphService.searchEmail(query);
  }
  
}

