import { Injectable } from '@angular/core';
import { Global } from 'src/app/global';
import { HttpClient } from '@angular/common/http';
import { StockAvailable } from '../model/stock-available.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AvailableStockService {

  private saveAvailableStockUrl = this.global.baseUrl + '/api/available-stock/save';
  private submitAvailableStockUrl = this.global.baseUrl + '/api/available-stock/submit';
  private getAvailableStockUrl = this.global.baseUrl + '/api/available-stock/get?branchId=';
  private getAllAvailableStockByActiveUrl = this.global.baseUrl + '/api/available-stock/get-by-active';
  private getAvailableStockByDateUrl = this.global.baseUrl + '/api/available-stock/get-by-date';

constructor(private http: HttpClient, private global: Global) { }

public save(item: StockAvailable): Observable<any> {
  return this.http.post<StockAvailable>(this.saveAvailableStockUrl, item);
}

public submit(item: StockAvailable): Observable<any> {
  return this.http.post<StockAvailable>(this.submitAvailableStockUrl, item);
}
public getAvailableStockByActive(): Observable<any> {
  return this.http.get<any>(this.getAllAvailableStockByActiveUrl);
}

public getAvailableStock(branchId): Observable<any> {
  return this.http.get<any>(this.getAvailableStockUrl + branchId);
}
public getAvailableStockByDate(item): Observable<any> {
  return this.http.post<any>(this.getAvailableStockByDateUrl, item);
}

}
