import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NoDaysRequiremets } from '../../model/admin/no-days-requirements.model';
import { Global } from 'src/app/global';
import { Observable } from 'rxjs';
import { UnadjustedDailyRequirements } from '../../model/admin/unasjusted-daily-requirements.model';
import { BranchDailyMinimalCapacity } from '../../model/admin/branch-daily-minimal-capacity.model';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {

  private saveNoDaysRequiremetsUrl = this.global.baseUrl + '/api/admin/data/save-no-days-requirements';
  private getNoDaysRequiremetsUrl =  this.global.baseUrl + '/api/admin/data/get-no-days-requirements';
  private saveUnadjustedDailyRequirementsUrl = this.global.baseUrl + '/api/admin/data/save-ud-daily-requirements';
  private getUnadjustedDailyRequirementsUrl =  this.global.baseUrl + '/api/admin/data/get-ud-daily-requirements';
  private saveBranchDailyMinimalCapacityUrl = this.global.baseUrl + '/api/admin/data/save-bdmc';
  private getBranchDailyMinimalCapacityUrl =  this.global.baseUrl + '/api/admin/data/get-bdmc';

constructor(private httpClient: HttpClient, private global: Global) { }


public saveNoDaysRequiremets(item: NoDaysRequiremets): Observable<any> {
  return this.httpClient.post<any>(this.saveNoDaysRequiremetsUrl, item);
}

public getNoDaysRequiremets(): Observable<NoDaysRequiremets> {
  return this.httpClient.get<NoDaysRequiremets>(this.getNoDaysRequiremetsUrl);
}

public saveUnadjustedDailyRequirements(item: UnadjustedDailyRequirements): Observable<any> {
  return this.httpClient.post<any>(this.saveUnadjustedDailyRequirementsUrl, item);
}

public getUnadjustedDailyRequirements(): Observable<UnadjustedDailyRequirements> {
  return this.httpClient.get<UnadjustedDailyRequirements>(this.getUnadjustedDailyRequirementsUrl);
}

public saveBranchDailyMinimalCapacity(item: BranchDailyMinimalCapacity): Observable<any> {
  return this.httpClient.post<any>(this.saveBranchDailyMinimalCapacityUrl, item);
}

public getBranchDailyMinimalCapacity(): Observable<BranchDailyMinimalCapacity> {
  return this.httpClient.get<BranchDailyMinimalCapacity>(this.getBranchDailyMinimalCapacityUrl);
}

}
