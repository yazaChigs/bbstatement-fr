import { Global } from './../../../../global';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserRole} from '../../../config/model/admin/user-role';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  private saveUrl = this.global.baseUrl + '/api/admin/user-role/save';
  private updateUrl = this.global.baseUrl + '/api/admin/user-role/update';
  private getAllUrl = this.global.baseUrl + '/api/admin/user-role/get-all';
  private deleteUrl = this.global.baseUrl + '/api/admin/user-role/delete?id=';
  private getItemUrl = this.global.baseUrl + '/api/admin/user-role/get-item?id=';
  private getUserEditRolesUrl = this.global.baseUrl + '/api/admin/user-role/get-user-roles/';
  private getGrantedAuthoritiesUrl = this.global.baseUrl + '/api/admin/user-role/get-user-roles/';
  private getModuleEditRolesUrl = this.global.baseUrl + '/api/admin/user-role/get-module-roles/';

  constructor(private http: HttpClient, private global: Global) { }

  public save(item: UserRole): Observable<any> {
    return this.http.post<any>(this.saveUrl, item);
  }

  public update(item: UserRole): Observable<any> {
    return this.http.put<any>(this.updateUrl, item);
  }

  public getAll(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(this.getAllUrl);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete<any>(this.deleteUrl + id);
  }

  public getItem(id: number): Observable<UserRole> {
    return this.http.get<UserRole>(this.getItemUrl + id);
  }
  public getUserRoles(userId: number): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(this.getUserEditRolesUrl + userId);
  }

  public getModuleRoles(moduleId: number): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(this.getModuleEditRolesUrl + moduleId);
  }

  public getGrantedAuthorities(): Observable<String[]> {
    return this.http.get<String[]>(this.getGrantedAuthoritiesUrl);
  }
}
