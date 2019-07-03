import { Global } from './../../../global';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class StaticDataService {
  private syncUrl = this.global.baseUrl + '/api/static/data/sync';
  constructor(private http: HttpClient, private global: Global) {}

  public getStaticData(): Observable<any> {
    return this.http.get<any>(this.syncUrl);
   }


}
