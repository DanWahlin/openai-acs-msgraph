import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';

import { SorterService } from '../core/sorter.service';
import { EventBusService, Events } from 'src/app/core/eventbus.service';
import { DataService } from '../core/data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogBase } from '../shared/textarea-dialog/dialog-data';
import { TextAreaDialogComponent } from '../shared/textarea-dialog/textarea-dialog.component';
import { AcsService } from '../core/acs.service';
import { PhonePipe } from '../shared/phone.pipe';
import { EmailSmsDialogData } from '../email-sms-dialog/email-sms-dialog-data';
import { EmailSmsDialogComponent } from '../email-sms-dialog/email-sms-dialog.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-customers-list',
    templateUrl: './customers-list.component.html',
    styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
    // Due to dynamic OpenAI query we're going with any[] for type of the data property
    private _data: any[] = [];
    get data(): any[] {
        return this._data;
    }
    set data(value: any[]) {
        if (value) {
            this.filteredData = this._data = value;
            if (value.length > 0) {
                const headers = Object.keys(this.data[0]);
                // filter out id property
                this.headers = headers.filter((h: string) => h !== 'id');
            }
        }
    }
    headers: string[] = [];
    filteredData: any[] = [];
    queryText = 'Get the total revenue for all orders. Group by company and include the city.';
    phonePipe = new PhonePipe();
    private subscriptions: Subscription[] = [];
    @Output() customerSelected = new EventEmitter<any>();

    dialog: MatDialog = inject(MatDialog);

    constructor(private dataService: DataService, private sorterService: SorterService,
        private eventBus: EventBusService) {
        this.getData();
    }

    ngOnInit() { }

    getData() {
        this.subscriptions.push(
            this.dataService.getCustomers().subscribe((data: any[]) => this.data = this.filteredData = data)
        );
    }

    filter(val: string) {
        const data = this.dataService.filter(val, this.data);
        this.filteredData = data ?? this.data;
    }

    getQueryData() {
        this.subscriptions.push(
            this.dataService.generateSql(this.queryText).subscribe((data: any) => {
                this.data = data;
            })
        );
    }

    reset() {
        this.getData();
    }

    sort(prop: string) {
        this.sorterService.sort(this.filteredData, prop);
    }

    trackBy(index: number, data: any) {
        return data.id;
    }

    getRelatedData(data: any) {
        this.customerSelected.emit(data);
    }

    openCallDialog(data: any) {
        this.eventBus.emit({ name: Events.CustomerCall, value: data });
    }

    openEmailSmsDialog(data: any) {
        if (data.phone && data.email) {
            const formattedPhone = this.phonePipe.transform(data.phone);
            let dialogData: EmailSmsDialogData = {
                prompt: '',
                title: `Contact ${data.company}`, // `Send SMS Message to ${formattedPhone} at ${data.company}`,
                customerPhoneNumber: data.phone,
                contactName: data.first_name + ' ' + data.last_name,
                company: data.company,
                email: data.email
            }

            const dialogRef = this.dialog.open(EmailSmsDialogComponent, {
                data: dialogData
            });

            this.subscriptions.push(
                dialogRef.afterClosed().subscribe(response => {
                    console.log('SMS dialog result:', response);
                    if (response) {
                        dialogData = response;
                    }
                })
            );
        }
        else {
            alert('No phone number available.');
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
