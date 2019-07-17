import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Global } from 'src/app/global';
import { Observable } from 'rxjs';
import { Branch } from '../model/admin/branch.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private saveAvailableStockUrl = this.global.baseUrl + '/api/available-stock/save';
  private submitAvailableStockUrl = this.global.baseUrl + '/api/available-stock/submit';
  private getBranchInfoUrl = this.global.baseUrl + '/api/dashboard/get-for-selected-branches';
  private getBranchInfoByDateUrl = this.global.baseUrl + '/api/dashboard/get-for-selected-branches-by-date';

constructor(private http: HttpClient, private global: Global) { }

public getBranchInfo(branches: Branch[]): Observable<any> {
  return this.http.post<Branch[]>(this.getBranchInfoUrl, branches);
}
public getBranchInfoByDate(value): Observable<any> {
  console.log(value);
  return this.http.post<any>(this.getBranchInfoByDateUrl, value);
}

// public submit(item: StockAvailable): Observable<any> {
//   return this.http.post<StockAvailable>(this.submitAvailableStockUrl, item);
// }

// public getBranchInfo(branches): Observable<any> {
//   return this.http.get<any>(this.getBranchInfoUrl + branches);
// }

}
