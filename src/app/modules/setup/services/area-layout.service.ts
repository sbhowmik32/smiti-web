import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AreaLayoutService {
  constructor(private http: HttpClient) {}

  getPagination(page?, itemPerPage?, searchKey?) {
    let params = new HttpParams();

    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', page);
      params = params.append('PageParams.PageSize', itemPerPage);
    }

    return this.http
      .get<any>(`${environment.apiUrl}v1/AreaLayouts/GetAll`, {
        params,
      })
      .pipe(map((response: any) => response));
  }

  getAreaLayoutDetailsList() {
    return this.http.get<any>(
      `${environment.apiUrl}/api/AreaLayouts/GetAllWithDetails`
    );
  }

  getAreaLayoutDetailsById(id: number) {
    return this.http.get<any>(
      `${environment.apiUrl}/api/AreaLayouts/GetAlleById?id=` + id
    );
  }

  create(area: any) {
    return this.http.post<any>(
      `${environment.apiUrl}v1/AreaLayouts/Save`,
      area
    );
  }
  delete(Id: number) {
    return this.http.delete<Response>(
      `${environment.apiUrl}v1/AreaLayouts/Remove?id=${Id}`
    );
  }

  getAreaLayoutMatrixById(id: number) {
    return this.http.get<Response>(
      `${environment.apiUrl}/api/AreaLayouts/GetAreaTableById?id=` + id
    );
  }
}
