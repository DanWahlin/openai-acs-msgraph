import { Component } from '@angular/core';
import { RelatedContentBaseComponent } from '../shared/related-content-base.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-emails',
    templateUrl: './emails.component.html',
    styleUrls: ['./emails.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, MatCardModule, MatButtonModule]
})
export class EmailsComponent extends RelatedContentBaseComponent {

  override async search(query: string) {
    this.data = await this.graphService.searchEmail(query);
  }
  
}

