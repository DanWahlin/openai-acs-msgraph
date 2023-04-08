import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'app-filter-textbox',
    template: `
        {{ label }} <input type="text" [(ngModel)]="filter" style="width: 250px" />
    `
})
export class FilterTextboxComponent implements OnInit {

    @Input() label = 'Filter Data:';

    private _filter = '';
    @Input() get filter() {
        return this._filter;
    }

    set filter(val: string) {
        this._filter = val;
        this.changed.emit(this.filter); // Raise changed event
    }

    @Output() changed: EventEmitter<string> = new EventEmitter<string>();

    constructor() { }

    ngOnInit() {

    }

}
