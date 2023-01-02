import { Component, OnInit } from '@angular/core';
import { RelatedContentBaseComponent } from '../shared/related-content-base.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent extends RelatedContentBaseComponent implements OnInit {
  
  ngOnInit() { 

  }

  override async search(query: string) {
    this.data = await this.graphService.searchChats(query);
  }

}
