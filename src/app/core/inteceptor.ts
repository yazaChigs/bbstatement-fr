import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
  HttpResponse, HttpUserEvent, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import {TokenStorage} from './token.storage';
import { Observable, EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from '../util/notifyutil';
import { StorageKey } from '../util/key';



const TOKEN_HEADER_KEY = 'Authorization';


@Injectable()
export class Interceptor implements HttpInterceptor {
  branch = sessionStorage.getItem(StorageKey.BRANCH_DETAIL);
  constructor(private token: TokenStorage, private router: Router,  private snotify: SnotifyService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    let authReq = req;
    const util = new NotifyUtil(this.snotify);
    if (this.token.getToken() != null) {
      authReq = req.clone({ headers: req.headers.
        set(TOKEN_HEADER_KEY, 'Bearer ' + this.token.getToken())
        .set('Branch', this.branch === null ? '' : this.branch)
      });
    }

    return next.handle(authReq).pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            console.log(err.error);
            if (err.status === 401) {
              this.snotify.error('Unathorized Access', 'Access Denied', util.getNotifyConfig());
              this.router.navigate(['/login']);
            } else if (err.status === 400) {
              this.snotify.error('Bad Request', 'Error', util.getNotifyConfig());
            } else if (err.status === 404) {
              this.snotify.error('Error 404', 'Not Found', util.getNotifyConfig());
            } else if (err.status === 403) {
              console.log('Forbidden');
            } else {
              console.log('Err Unknown');
            }
            return throwError(err);
          }
        })
      );

  }

}
