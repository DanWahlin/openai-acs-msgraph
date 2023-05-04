import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RelatedContentBaseComponent } from '../shared/related-content-base.component';
import { NgIf } from '@angular/common';

type FileDetail = { detail: { webUrl: string } };

@Component({
    selector: 'app-files',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss'],
    standalone: true,
    imports: [NgIf],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FilesComponent extends RelatedContentBaseComponent {

  override async search(query: string) {
    this.data = await this.graphService.searchFiles(query);
  }

  itemClick(e: FileDetail) {
    window.open(e.detail.webUrl, '_blank');
  }
}
