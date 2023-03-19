import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Customer } from '../../app/shared/customer';

@Injectable({providedIn: 'root'})
export class DataService {
    customersUrl = 'assets/data.json';
    apiBaseUrl = 'http://localhost:3000/api/';

    constructor(private http: HttpClient) { }

    getCustomers(): Observable<Customer[]> {
      return this.http.get<any[]>(this.apiBaseUrl + 'customers')
        .pipe(
          map(data => {
            // Sort by name
            return data.sort((a: Customer, b: Customer) => {
              if (a.company < b.company) {
                return -1;
              } 
              if (a.company > b.company) {
                return 1;
              }
              return 0;
            });
          }),
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

    generateSql(query: string) : Observable<any> {
      return this.http.post<any>(this.apiBaseUrl + 'generatesql', { query })
        .pipe(
          catchError(this.handleError)
        );
    }

    getAcsToken() : Observable<any> {
      return this.http.get<any>(this.apiBaseUrl + 'acstoken')
        .pipe(
          catchError(this.handleError)
        );
    }

    filter(val: string, data: any[]) {
      if (val) {
          val = val.toLowerCase();
          const filteredData = data.filter((data: any) => {
              for (const property in data) {
                  const propValue = data ? data[property].toString().toLowerCase() : '';
                  if (propValue && propValue.indexOf(val) > -1) {
                      return true;
                  }
              }
              return false;
          });
          return filteredData;
      } else {
          return null;
      }
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