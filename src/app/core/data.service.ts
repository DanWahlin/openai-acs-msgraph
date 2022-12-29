import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Customer } from '../../app/shared/customer';

@Injectable({providedIn: 'root'})
export class DataService {
    customersUrl = 'assets/data.json';

    constructor(private http: HttpClient) { }

    getCustomers(): Observable<Customer[]> {
      return this.http.get<Customer[]>(this.customersUrl)
        .pipe(
          catchError(this.handleError)
        );

    }

    getCustomer(id: number): Observable<Customer> {
      return this.http.get<Customer[]>(this.customersUrl)
        .pipe(
          map(customers => {
            const customer = customers.filter((cust: Customer) => cust.id === id);
            return customer[0];
          }),
          catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
      console.error('server error:', error);
      if (error.error instanceof Error) {
          const errMessage = error.error.message;
          return throwError(() => errMessage);
          // Use the following instead if using lite-server
          // return Observable.throw(err.text() || 'backend server error');
      }
      return throwError(() => error || 'Node.js server error');
  }

}