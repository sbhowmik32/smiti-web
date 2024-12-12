import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPaymentService {

  onManageChargeCreated: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  baseUrl = environment.apiUrl;


savedueSubPayment(obj: any[], memberId: number) {
  return this.httpClient.post<any>(
    `${environment.apiUrl}v1/SubscriptionPayments/SaveDuePayment?memberId=${memberId}`,
    obj
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
}
