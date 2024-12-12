import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActivityTicketTypeService {
  onActivityTicketTypeCreated: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  baseUrl = environment.apiUrl;

  createActivityTicketType(data): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + 'v1/ServiceTicketTypes/Save', data)
      .pipe(catchError(this.handleError));
  }

  updateActivityTicketType(data): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'v1/ServiceTypes/' + data.id, data)
      .pipe(catchError(this.handleError));
  }

  getById(id): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'v1/ServiceTypes/' + id)
      .pipe(catchError(this.handleError));
  }
  deleteActivityTicketType(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.baseUrl + 'v1/ServiceTicketTypes/Remove?id=' + id)
      .pipe(catchError(this.handleError));
  }

  getActivityTicketTypePagination(page?, itemPerPage?, searchKey?) {
    let params = new HttpParams();

    if (searchKey != null) {
      params = params.append('SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageNumber', page);
      params = params.append('PageSize', itemPerPage);
    }

    return this.httpClient
      .get<any>(`${this.baseUrl}v1/ServiceTicketTypes/GetAll`, {
        params,
      })
      .pipe(map((response: any) => response));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error: ', errorResponse.error);
    } else {
      console.error('Server Side error', errorResponse);
    }
    return throwError('There is a problem with the service');
  }
}