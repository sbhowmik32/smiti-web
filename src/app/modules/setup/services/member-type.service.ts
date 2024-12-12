import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MemberTypeService {
  onMemberTypeCreated: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  baseUrl = environment.apiUrl;

  createMemberType(data): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + 'MemberTypes/Save', data)
      .pipe(catchError(this.handleError));
  }

  deleteMemberType(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.baseUrl + 'MemberTypes/Remove?id=' + id)
      .pipe(catchError(this.handleError));
  }

  getMemberTypePagination(page?, itemPerPage?, searchKey?) {
    let params = new HttpParams();
    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', page);
      params = params.append('PageParams.PageSize', itemPerPage);
    }

    return this.httpClient
      .get<any>(`${this.baseUrl}MemberTypes/GetAll`, {
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
