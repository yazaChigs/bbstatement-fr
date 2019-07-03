import { Global } from './../global';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  private getTokenUrl = this.global.baseUrl + '/authentication';
  private getUserUrl = this.global.baseUrl + '/user';
  private sendEmailUrl = this.global.baseUrl + '/api/user/password/reset/email?email=';
  private saveNewPasswordUrl = this.global.baseUrl + '/api/user/password/reset/token';
  constructor(private http: HttpClient, private global: Global) {
  }

  attemptAuth(userName: string, password: string): Observable<any> {
    const credentials = {userName: userName, password: password};
    return this.http.post<any>(this.getTokenUrl, credentials);
  }
  public sendForgotEmail(email: string): Observable<any> {
    return this.http.get<any>(this.sendEmailUrl + email);
  }
  public saveNewPassword(token: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('password', password);
    return this.http.post<any>(this.saveNewPasswordUrl, formData);
  }

  public getUser(): Observable<any> {
    return this.http.get<any>(this.getUserUrl);
  }
}
