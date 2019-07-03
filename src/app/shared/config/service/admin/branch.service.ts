import { Injectable } from '@angular/core';
import { Branch } from '../../model/admin/branch.model';
import { Global } from 'src/app/global';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private saveUrl = this.global.baseUrl + '/api/admin/branch/save';
  private saveLogoUrl =  this.global.baseUrl + '/api/admin/branch/save-logo';
  private getAllUrl =  this.global.baseUrl + '/api/admin/branch/get-all';
  private getUserBranchUrl =  this.global.baseUrl + '/api/admin/branch/get-user-ranch';
  private getAllForUserUrl =  this.global.baseUrl + '/api/admin/branch/get-all-for-user';
  private getThemeUrl = this.global.baseUrl + '/api/admin/branch/get-theme';
  private getItemUrl = this.global.baseUrl + '/api/admin/branch/get-item?id=';
  private uploadFileUrl = this.global.baseUrl + '/api/admin/branch/patient-csv';
  private subject = new BehaviorSubject<any>(new Branch());

  constructor(private httpClient: HttpClient, private global: Global) { }

  public save(item: Branch): Observable<any> {
    return this.httpClient.post<any>(this.saveUrl, item);
  }

  public getAll(): Observable<Branch[]> {
    return this.httpClient.get<Branch[]>(this.getAllUrl);
  }

  public getUsersBranch(): Observable<Branch> {
    return this.httpClient.get<Branch>(this.getUserBranchUrl);
  }

  public getAllForUser(): Observable<Branch[]> {
    return this.httpClient.get<Branch[]>(this.getAllForUserUrl);
  }

  public getTheme(): Observable<any> {
    return this.httpClient.get<any>(this.getThemeUrl);
  }
  public saveLogo(file: Blob, id: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id.toString());
    return this.httpClient.post<any>(this.saveLogoUrl, formData);
  }

  pushFileToStorage(
    file: File, name: string, templateColor: string, address: string, email: string,
     phoneNumber: string, officePhone: string): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('address', address);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('officePhone', officePhone);
    console.log(officePhone);
    formData.append('templateColor', templateColor);
    const req = new HttpRequest('POST', this.saveUrl, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.httpClient.request(req);
  }
  public getItem(id: number): Observable<Branch> {
    return this.httpClient.get<Branch>(this.getItemUrl + id);
  }
  /**
   *Upload File For Radiology Order
   */
  public uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(this.uploadFileUrl, formData);
  }

  setBranch(data: any) {
    this.subject.next(data);
}

clearBranch() {
  this.subject.next(undefined);
}

  /**
   *
   *Get Branch Information stored temporarily
  */
  getBranch(): Observable<any> {
      return this.subject.asObservable();
  }

}
