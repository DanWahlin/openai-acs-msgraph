import { Component } from '@angular/core';
import { RelatedContentBaseComponent } from '../shared/related-content-base.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent extends RelatedContentBaseComponent {

  override async search(query: string) {
    this.data = await this.graphService.searchFiles(query);
  }

  itemClick(e: any) {
    window.open(e.detail.webUrl, '_blank');
  }
}
