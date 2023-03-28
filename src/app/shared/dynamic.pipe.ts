import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { PhonePipe } from './phone.pipe';

@Pipe({
  name: 'dynamic'
})
export class DynamicPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe, private datePipe: DatePipe, 
    private decimalPipe: DecimalPipe, private phonePipe: PhonePipe) { }

  currencyHeaders = ['price', 'total', 'amount', 'sum', 'balance', 'revenue'];
  dateHeaders = ['date', 'time', 'created', 'updated', 'deleted'];
  phoneHeaders = ['phone', 'mobile', 'phone number', 'mobile number', 'office number'];

  transform(value: any, header: string): any {
    if (this.currencyHeaders.some(substr => header.includes(substr))) {
      return this.currencyPipe.transform(value);
    }

    if (this.dateHeaders.some(substr => header.includes(substr))) {
      return this.datePipe.transform(value);
    }

    if (header.includes('review')) {
      return this.decimalPipe.transform(value, '1.0-1');
    }

    if (this.phoneHeaders.some(substr => header.includes(substr))) {
      return this.phonePipe.transform(value);
    }

    return value;
  }
}