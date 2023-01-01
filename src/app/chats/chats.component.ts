import { Component, OnInit } from '@angular/core';
import { Customer } from '../shared/customer';
import { RelatedDataComponent } from '../shared/related-data.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent extends RelatedDataComponent implements OnInit {
  
  ngOnInit() { 

  }

  override async search(query: string) {
    this.data = await this.graphService.searchChats(query);
  }

}
