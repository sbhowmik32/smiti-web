import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TopupService {
  onAddonsItemCreated: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  baseUrl = environment.apiUrl;
  getPagination(page?, itemPerPage?, memberShipNo?, startDate?, endDate?) {
    let params = new HttpParams();

    if (memberShipNo != null) {
      params = params.append('MemberShipNo', memberShipNo);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageNumber', page);
      params = params.append('PageSize', itemPerPage);
    }
    if (page != null && itemPerPage != null) {
      params = params.append('StartDate', startDate);
      params = params.append('EndDate', endDate);
    }

    return this.httpClient
      .get<any>(`${this.baseUrl}TopUps/GetAll`, {
        params,
      })
      .pipe(map((response: any) => response));
  }
  getTopUpsReport(id): Observable<Blob> {
    return this.httpClient.get(
      `${environment.apiUrl}TopUps/TopUpsReport?id=${id}`,
      {
        responseType: 'blob',
      }
    );
  }

  getAllPaymentMethod() {
    return this.httpClient.get<any>(`${environment.apiUrl}Commons/GetAllPaymentMethod`);
  }

  getAllCreditCard() {
    return this.httpClient.get<any>(`${environment.apiUrl}Commons/GetAllCreditCard`);
  }
  createTopUp(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}TopUps/CreateTopUp`, obj);
  }
}
