import { Injectable } from '@angular/core';
import { Global } from 'src/app/global';
import { StockQuarantined } from '../model/Stock-quarantined.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuarantinedStockService {
  private saveAvailableStockUrl = this.global.baseUrl + '/api/quarantined-stock/save';
  private getAvailableStockUrl = this.global.baseUrl + '/api/quarantined-stock/get?branchId=';

constructor(private http: HttpClient, private global: Global) { }

public save(item: StockQuarantined): Observable<any> {
  console.log(item);
  return this.http.post<StockQuarantined>(this.saveAvailableStockUrl, item);
}

public getAvailableStock(branchId): Observable<any> {
  return this.http.get<any>(this.getAvailableStockUrl + branchId);
}

}
