import { Component, Input } from "@angular/core";
import { GraphService } from "../core/graph.service";

@Component({
    template: ``
})
export abstract class RelatedDataComponent {
    data: any[] = [];

    private _searchText: string | null = null;
    @Input() get searchText(): string | null {
      return this._searchText;
    }
  
    set searchText(value: string | null) {
      this._searchText = value;
      if (value) {
        this.search(value);
      }
    }

    abstract search(searchText: string) : Promise<any>;
  
    constructor(public graphService: GraphService) {}
}