import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlotSettingsService {
  baseUrl: string;
  constructor(private httpClient: HttpClient) {}


  getallServiceSlotSettings() {
    return this.httpClient
      .get(`${environment.apiUrl}ServiceSlotSettings/GetAll`)
      .pipe(map((response: any) => response));
  }
  getServiceSlotSettingsById(id: number) {
    return this.httpClient
      .get(`${environment.apiUrl}ServiceSlotSettings/GetById?id=${id}`)
      .pipe(map((response: any) => response));
  }
  getServiceSlotSettingsByServiceId(id: number) {
    return this.httpClient
      .get(`${environment.apiUrl}ServiceSlotSettings/GetByServiceId?serviceId=${id}`)
      .pipe(map((response: any) => response));
  }
  saveSlotSettings(ServiceSlotSettingsReqs: any) {
    return this.httpClient
      .post(`${environment.apiUrl}ServiceSlotSettings/Save`, ServiceSlotSettingsReqs)
      .pipe(map((response: any) => response));
  }
  getAllServiceOnly(pageNo: number, pageSize: number) {
    return this.httpClient.get<any>(
      `${environment.apiUrl}v1/MemServices/GetAllServiceOnly?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }


  

  deleteServiceSlotSettings(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.baseUrl + 'v1/CommitteeCategories/Remove?id=' + id)
      .pipe(catchError(this.handleError));
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
