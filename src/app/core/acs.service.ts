import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SmsResponse } from '../shared/interfaces';

declare const API_BASE_URL: string;

@Injectable({
  providedIn: 'root'
})
export class AcsService {

  constructor(private http: HttpClient) { }

  sendSms(message: string, customerPhoneNumber: string) : Observable<SmsResponse> {
    return this.http.post<SmsResponse>(API_BASE_URL + 'sendsms', { message, customerPhoneNumber })
    .pipe(
      catchError(this.handleError)
    );
  }  

  sendEmail(message: string, email: string) {
    return this.http.post(API_BASE_URL + 'sendemail', { message, email })
    .pipe(
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
