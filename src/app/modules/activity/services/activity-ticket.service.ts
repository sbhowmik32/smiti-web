import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActivityTicketService {

  onActivityTicketCreated: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  baseUrl = environment.apiUrl;

  createActivityTicket(data): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + 'v1/ServiceTickets/Save', data)
      .pipe(catchError(this.handleError));
  }

  updateActivityTicket(data): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'v1/ServiceTypes/' + data.id, data)
      .pipe(catchError(this.handleError));
  }

  getById(id): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'v1/ServiceTickets/GetServiceTicketById?ticketId=' + id)
      .pipe(catchError(this.handleError));
  }
  deleteActivityTicket(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.baseUrl + 'v1/ServiceTypes/Remove?id=' + id)
      .pipe(catchError(this.handleError));
  }

  getActivityTicketPagination(page?, itemPerPage?, searchKey?,filters?) {
    let params = new HttpParams();

    if (filters) {
      if (filters.StartDate) {
        params = params.append('StartDate', filters.StartDate);
      }
      if (filters.EndDate) {
        params = params.append('EndDate', filters.EndDate);
      }
      if (filters.ServiceId) {
        params = params.append('ServiceId', filters.ServiceId);
      }
      if (filters.ServiceTypeId) {
        params = params.append('ServiceTypeId', filters.ServiceTypeId);
      }
      if (filters.SearchText) {
        params = params.append('SearchText', filters.SearchText);
      }
      
   
    }
    
    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', page);
      params = params.append('PageParams.PageSize', itemPerPage);
    }

    return this.httpClient
      .get<any>(`${this.baseUrl}v1/ServiceTickets/GetDataPaginate`, {
        params,
      })
      .pipe(map((response: any) => response));
  }

  getServiceTypeBySelectedCategory(Id: number) {
    return this.httpClient.get<any>(`${environment.apiUrl}v1/MemServices/GetById?id=${Id}`);
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
