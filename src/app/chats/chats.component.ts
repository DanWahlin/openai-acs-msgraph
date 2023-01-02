import { Component, OnInit } from '@angular/core';
import { RelatedDataComponent } from '../shared/related-content.component';

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
