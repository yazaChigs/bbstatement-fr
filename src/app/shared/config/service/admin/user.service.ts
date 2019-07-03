import { Global } from './../../../../global';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { User } from '../../../config/model/admin/user.model';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private saveLocationUrl = this.global.baseUrl + '/api/admin/user/save';
  private getAllUrl = this.global.baseUrl + '/api/admin/user/get-all';
  private getAllInActiveUrl = this.global.baseUrl + '/api/admin/user/inactive';
  private activateUserUrl = this.global.baseUrl + '/api/admin/user/activate/';
  private deleteUserUrl = this.global.baseUrl + '/api/admin/user/delete?id=';
  private changePasswordUrl = this.global.baseUrl + '/api/admin/user/change-password';
  private getPhysicianUrl = this.global.baseUrl + '/api/admin/user/get-physicians';
  private subject = new BehaviorSubject<any>(new User());

  constructor(private http: HttpClient, private global: Global) { }

  public saveUser(item: User): Observable<any> {
    return this.http.post<any>(this.saveLocationUrl, item);
  }
  public getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.getAllUrl);
  }
  public getAllInActiveAccounts(): Observable<User[]> {
    return this.http.get<User[]>(this.getAllInActiveUrl);
  }

  public getPhysicians(): Observable<User[]> {
    return this.http.get<User[]>(this.getPhysicianUrl);
  }

  public activateUserAccount(userId: number): Observable<any> {
    return this.http.get<any>(this.activateUserUrl + userId);
  }
   /**
   *Delete User
   */
  public deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(this.deleteUserUrl + id);
  }
  public changePassword(id: number, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('password', password);
    return this.http.post<any>(this.changePasswordUrl, formData);
  }

    /**
     *
     *Temporarily Store User Information
     */
      setUser(data: any) {
        this.subject.next(data);
    }

    clearUser() {
      this.subject.next(undefined);
    }

      /**
       *
       *Get User Information stored temporarily
      */
      getUser(): Observable<any> {
          return this.subject.asObservable();
      }

}
