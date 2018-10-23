import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError, finalize, map } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
export class AuthInspector implements HttpInterceptor{
    intercept(req:HttpRequest<any>, next:HttpHandler): Observable<HttpEvent<any>>{

        const modifiedReq = req.clone({
            headers: this.addExtraHeaders(req.headers)
          });

        var ip = window.location.origin;
        return next.handle(modifiedReq);
    }

    private addExtraHeaders(headers: HttpHeaders): HttpHeaders {
        headers = headers.append('token', JSON.stringify(localStorage.getItem('auth_app_token')));
        return headers;
      }

}

@Injectable()
export class HTTPStatus {
  private requestInFlight$: BehaviorSubject<boolean>;
  constructor() {
    this.requestInFlight$ = new BehaviorSubject(false);
  }

  setHttpStatus(inFlight: boolean) {
    this.requestInFlight$.next(inFlight);
  }

  getHttpStatus(): Observable<boolean> {
    return this.requestInFlight$.asObservable();
  }
}

@Injectable()
export class HTTPListener implements HttpInterceptor {
  constructor(private status: HTTPStatus) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        return event;
      }),
      catchError(error => {
        return Observable.throw(error);
      }),
      finalize(() => {
        this.status.setHttpStatus(false);
      })
    )
  }
}