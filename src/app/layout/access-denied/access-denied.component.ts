import { Component, OnInit } from '@angular/core';
import { NotifyUtil } from './../../util/notifyutil';
import { Snotify, SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  util;
  constructor(private notify: SnotifyService) {
    this.util = new NotifyUtil(notify);
   }

  ngOnInit() {
    this.notify.info('Access Denied', '', this.util.getNotifyConfig());
  }

}
