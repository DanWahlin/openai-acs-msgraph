import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

declare const API_BASE_URL: string;

interface SmsResponse {
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AcsService {

  constructor(private http: HttpClient) { }

  sendSms(message: string, toPhone: string) : Observable<SmsResponse> {
    return this.http.post<SmsResponse>(API_BASE_URL + 'sendsms', { message, toPhone })
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
