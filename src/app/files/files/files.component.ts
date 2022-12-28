import { Component, OnInit } from '@angular/core';
import { GraphService } from 'src/app/core/graph.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  files: any[] = [];

  constructor(private graphService: GraphService) {}

  async ngOnInit() {
    this.files = await this.graphService.searchFiles('tailwind traders');
  }

  itemClick(e: any) {
    window.open(e.detail.webUrl, '_blank');
  }
}
