/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { GraphService } from "../core/graph.service";

@Component({
    template: ``
})
export abstract class RelatedContentBaseComponent {

    @Output()
    dataLoaded: EventEmitter<any> = new EventEmitter();

    private _data: any[] = [];
    @Input() get data(): any[] {
      return this._data;
    }

    set data(value: any[]) {
      this._data = value;
      this.dataLoaded.emit(value);
    }

    private _searchText = '';
    @Input() get searchText(): string {
      return this._searchText;
    }
  
    set searchText(value: string) {
      this._searchText = value;
      //if (value) {
        this.search(value as string);
      //}
    }

    abstract search(searchText: string) : Promise<any>;
  
    constructor(public graphService: GraphService) {}
}