import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TempStoreService {
  private subject = new BehaviorSubject<any>(null);

  constructor() { }


  /**
   *
   *Temporarily Store Data
   */
  setData(data: any) {
    this.subject.next(data);
  }

  clearData() {
    this.subject.next(null);
  }

  /**
   *
   *Get Data stored temporarily
  */
  getData(): Observable<any> {
    return this.subject.asObservable();
  }

}
