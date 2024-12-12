import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  onActivityCreated: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  baseUrl = environment.apiUrl;

  createActivity(data): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + 'v1/MemServices/Save', data)
      .pipe(catchError(this.handleError));
  }

  updateActivity(data): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'Activitys/' + data.id, data)
      .pipe(catchError(this.handleError));
  }

  getById(id): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'Activitys/' + id)
      .pipe(catchError(this.handleError));
  }
  deleteActivity(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.baseUrl + 'v1/MemServices/Remove?id=' + id)
      .pipe(catchError(this.handleError));
  }

  getActivityPagination(page?, itemPerPage?, searchKey?) {
    let params = new HttpParams();

    if (searchKey != null) {
      params = params.append('SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageNumber', page);
      params = params.append('PageSize', itemPerPage);
    }

    return this.httpClient
      .get<any>(`${this.baseUrl}v1/MemServices/GetAll`, {
        params,
      })
      .pipe(map((response: any) => response));
  }

  getServiceTypeData() {
    return this.httpClient.get<any>(
      `${environment.apiUrl}v1/ServiceTypes/GetServiceTypes`
    );
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
