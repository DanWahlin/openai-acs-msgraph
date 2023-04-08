import { Component, Input, OnInit } from '@angular/core';
import { RelatedContentBaseComponent } from '../shared/related-content-base.component';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent extends RelatedContentBaseComponent implements OnInit {

  ngOnInit() { }

  override async search(query: string) {
    this.data = await this.graphService.searchEmail(query);
  }
  
}

