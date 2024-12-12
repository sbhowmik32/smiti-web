import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  onManageChargeCreated: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  baseUrl = environment.apiUrl;

  getSubscriptionPaymentList(
    startDate: any,
    endDate: any,
    memberShipNo: any,
    pageNo: any,
    pageSize: any
  ) {
    return this.httpClient.get<any>(
      `${environment.apiUrl}v1/SubscriptionPayments/GetAllSubscriptionPayment?startDate=${startDate}&endDate=${endDate}&memberShipNo=${memberShipNo}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  getSubscriptionPaymentNo(paymentNo) {
    return this.httpClient.get<any>(
      `${environment.apiUrl}v1/SubscriptionPayments/GetSubscriptionPayment?payemntNo=${paymentNo}`
    );
  }

  getSubscriptionPaymentReport(payemntNo): Observable<Blob> {
    return this.httpClient.get(
      `${environment.apiUrl}v1/SubscriptionPayments/GetSubscriptionPaymentReport?payemntNo=${payemntNo}`,
      {
        responseType: 'blob',
      }
    );
  }
  getMemberInfoByMemberShipNo(memberShipNo: string) {
    return this.httpClient
      .get<any>(`${environment.apiUrl}v1/RegisterMembers/GetByMemberShipNo?memberShipNo=${memberShipNo}`)
      .pipe(map((response: any) => response.Data));
  }
  getSubscriptionPaymentPaidUpTo(id: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}v1/SubscriptionPayments/PaidListByMemberId?id=${id}`);
  }
  getSubscriptionPaymentDueList(id: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}v1/SubscriptionPayments/DueListByMemberId?id=${id}`);
  }
  getSubscriptionPaymentAdvancedList(id: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}v1/SubscriptionPayments/AdvancedListByMemberId?id=${id}`);
  }
}
