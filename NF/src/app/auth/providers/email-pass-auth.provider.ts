/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { NgEmailPassAuthProviderConfig } from './email-pass-auth.options';
import { NbAuthResult } from '../services/auth-result';
import { NbAbstractAuthProvider } from './abstract-auth.provider';
import { getDeepFromObject } from '../helpers';
import { NbUser } from '../models/user';


@Injectable()
export class NbEmailPassAuthProvider extends NbAbstractAuthProvider {

  protected defaultConfig: NgEmailPassAuthProviderConfig = {
    baseEndpoint: '/api/auth/',
    login: {
      alwaysFail: false,
      rememberMe: true, // TODO: what does that mean?
      endpoint: 'login',
      method: 'post',
      redirect: {
        success: '/',
        failure: null,
      },
      defaultErrors: [''],
      defaultMessages: ['You have been successfully logged in.'],
    },
    register: {
      alwaysFail: false,
      rememberMe: true,
      endpoint: 'register',
      method: 'post',
      redirect: {
        success: '/',
        failure: null,
      },
      defaultErrors: ['Something went wrong, please try again.'],
      defaultMessages: ['You have been successfully registered.'],
    },
    logout: {
      alwaysFail: false,
      endpoint: 'logout',
      method: 'delete',
      redirect: {
        success: '/',
        failure: null,
      },
      defaultErrors: ['Something went wrong, please try again.'],
      defaultMessages: ['You have been successfully logged out.'],
    },
    changePass: {
      endpoint: 'change-pass',
      method: 'post',
      redirect: {
        success: '/auth/login',
        failure: null,
      },
      defaultErrors: ['Something went wrong, please try again.'],
      defaultMessages: ['Password has been changed successfully! Please login again using your new password!'],
    },
    forgotPass: {
      endpoint: 'forgot-pass',
      method: 'post',
      redirect: {
        success: '/',
        failure: null,
      },
      //resetPasswordTokenKey: 'reset_password_token',
      defaultErrors: ['Something went wrong, please try again.'],
      defaultMessages: ['A Link to reset your password has been sent to your E-Mail ID. Link is valid for 1 hour from now'],
    },
    refreshToken: {
      endpoint: 'refresh-token',
      method: 'post',
      redirect: {
        success: null,
        failure: null,
      },
      defaultErrors: ['Something went wrong, please try again.'],
      defaultMessages: ['Your token has been successfully refreshed.'],
    },
    token: {
      key: 'data.token',
      getter: (module: string, res: HttpResponse<Object>) => getDeepFromObject(res.body,
        this.getConfigValue('token.key')),
    },
    errors: {
      key: 'data.errors',
      getter: (module: string, res: HttpErrorResponse) => getDeepFromObject(res.error,
        this.getConfigValue('errors.key'),
        this.getConfigValue(`${module}.defaultErrors`)),
    },
    messages: {
      key: 'data.messages',
      getter: (module: string, res: HttpResponse<Object>) => getDeepFromObject(res.body,
        this.getConfigValue('messages.key'),
        this.getConfigValue(`${module}.defaultMessages`)),
    },
  };

  constructor(protected http: HttpClient, private route: ActivatedRoute) {
    super();
  }

  authenticate(data?: any): Observable<NbAuthResult> {
    
    const method = this.getConfigValue('login.method');
    const url = this.getActionEndpoint('login');
    return this.http.request(method, url, {body: data, observe: 'response'})
      .pipe(
        map((res) => {
          if (this.getConfigValue('login.alwaysFail')) {
            console.log("came here");
            throw this.createFailResponse(data);
          }
          return res;
        }),
        this.validateToken('login'),
        map((res) => {
          return new NbAuthResult(
            true,
            res,
            this.getConfigValue('login.redirect.success'),
            this.getConfigValue('errors.getter')('login', res),
            this.getConfigValue('messages.getter')('login', res),
            this.getConfigValue('token.getter')('login', res),
          );
        }),
        catchError((res) => {
          let errors = [];
          if (res instanceof HttpErrorResponse) {
            errors = this.getConfigValue('errors.getter')('login', res);
          } else {
            console.log("came here in http error");
            errors.push(res.error);
          }

          return observableOf(
            new NbAuthResult(
              false,
              res,
              this.getConfigValue('login.redirect.failure'),
              errors,
            ));
        }),
      );
  }

  register(data?: any): Observable<NbAuthResult> {
    const method = this.getConfigValue('register.method');
    const url = this.getActionEndpoint('register');
    return this.http.request(method, url, {body: data, observe: 'response'})
      .pipe(
        map((res) => {
          if (this.getConfigValue('register.alwaysFail')) {
            throw this.createFailResponse(data);
          }

          return res;
        }),
        this.validateToken('register'),
        map((res) => {
          return new NbAuthResult(
            true,
            res,
            this.getConfigValue('register.redirect.success'),
            [],
            this.getConfigValue('messages.getter')('register', res),
            this.getConfigValue('token.getter')('register', res));
        }),
        catchError((res) => {
          let errors = [];
          if (res instanceof HttpErrorResponse) {
            errors = this.getConfigValue('errors.getter')('register', res);
          } else {
            errors.push('Something went wrong.');
          }

          return observableOf(
            new NbAuthResult(
              false,
              res,
              this.getConfigValue('register.redirect.failure'),
              errors,
            ));
        }),
      );
  }

  changePassword(data?: any): Observable<NbAuthResult> {
    const method = this.getConfigValue('changePass.method');
    const url = this.getActionEndpoint('changePass');
    return this.http.request(method, url, {body: data, observe: 'response'})
      .pipe(
        map((res) => {
          if (this.getConfigValue('changePass.alwaysFail')) {
            throw this.createFailResponse();
          }

          return res;
        }),
        map((res) => {
          return new NbAuthResult(
            true,
            res,
            this.getConfigValue('changePass.redirect.success'),
            [],
            this.getConfigValue('messages.getter')('changePass', res));
        }),
        catchError((res) => {
          let errors = [];
          if (res instanceof HttpErrorResponse) {
            errors = this.getConfigValue('errors.getter')('changePass', res);
          } else {
            errors.push('Something went wrong.');
          }

          return observableOf(
            new NbAuthResult(
              false,
              res,
              this.getConfigValue('changePass.redirect.failure'),
              errors,
            ));
        }),
      );
  }

  forgotPassword(data: any = {}): Observable<NbAuthResult> {
    const tokenKey = this.getConfigValue('forgotPass.forgotPasswordTokenKey');
    data[tokenKey] = this.route.snapshot.queryParams[tokenKey];
    
    const method = this.getConfigValue('forgotPass.method');
    const url = this.getActionEndpoint('forgotPass');
    return this.http.request(method, url, {body: data, observe: 'response'})
      .pipe(
        map((res) => {
          if (this.getConfigValue('forgotPass.alwaysFail')) {
            throw this.createFailResponse();
          }

          return res;
        }),
        map((res) => {
          return new NbAuthResult(
            true,
            res,
            this.getConfigValue('forgotPass.redirect.success'),
            [],
            this.getConfigValue('messages.getter')('forgotPass', res));
        }),
        catchError((res) => {
          let errors = [];
          if (res instanceof HttpErrorResponse) {
            errors = this.getConfigValue('errors.getter')('forgotPass', res);
          } else {
            errors.push('Something went wrong.');
          }

          return observableOf(
            new NbAuthResult(
              false,
              res,
              this.getConfigValue('resetPass.redirect.failure'),
              errors,
            ));
        }),
      );
  }

  logout(): Observable<NbAuthResult> {

    const method = this.getConfigValue('logout.method');
    const url = this.getActionEndpoint('logout');

    return observableOf({})
      .pipe(
        switchMap((res: any) => {
          if (!url) {
            return observableOf(res);
          }
          return this.http.request(method, url, {observe: 'response'});
        }),
        map((res) => {
          if (this.getConfigValue('logout.alwaysFail')) {
            throw this.createFailResponse();
          }

          return res;
        }),
        map((res) => {
          return new NbAuthResult(
            true,
            res,
            this.getConfigValue('logout.redirect.success'),
            [],
            this.getConfigValue('messages.getter')('logout', res));
        }),
        catchError((res) => {
          let errors = [];
          if (res instanceof HttpErrorResponse) {
            errors = this.getConfigValue('errors.getter')('logout', res);
          } else {
            errors.push('Something went wrong.');
          }

          return observableOf(
            new NbAuthResult(
              false,
              res,
              this.getConfigValue('logout.redirect.failure'),
              errors,
            ));
        }),
      );
  }

  refreshToken(data?: any): Observable<NbAuthResult> {
    const method = this.getConfigValue('refreshToken.method');
    const url = this.getActionEndpoint('refreshToken');

    return this.http.request(method, url, {body: data, observe: 'response'})
      .pipe(
        map((res) => {
          if (this.getConfigValue('refreshToken.alwaysFail')) {
            throw this.createFailResponse(data);
          }

          return res;
        }),
        this.validateToken('refreshToken'),
        map((res) => {
          return new NbAuthResult(
            true,
            res,
            this.getConfigValue('refreshToken.redirect.success'),
            [],
            this.getConfigValue('messages.getter')('refreshToken', res),
            this.getConfigValue('token.getter')('refreshToken', res));
        }),
        catchError((res) => {
          let errors = [];
          if (res instanceof HttpErrorResponse) {
            errors = this.getConfigValue('errors.getter')('refreshToken', res);
          } else {
            errors.push('Something went wrong.');
          }

          return observableOf(
            new NbAuthResult(
              false,
              res,
              this.getConfigValue('refreshToken.redirect.failure'),
              errors,
            ));
        }),
      );
  }

  protected validateToken (module: string): any {
    return map((res) => {
      const token = this.getConfigValue('token.getter')(module, res);
      if (!token) {
        const key = this.getConfigValue('token.key');
        console.warn(`NbEmailPassAuthProvider:
                          Token is not provided under '${key}' key
                          with getter '${this.getConfigValue('token.getter')}', check your auth configuration.`);

        throw new Error('Could not extract token from the response.');
      }
      return res;
    });
  }

  protected getActionEndpoint(action: string): string {
    const actionEndpoint: string = this.getConfigValue(`${action}.endpoint`);
    const baseEndpoint: string = this.getConfigValue('baseEndpoint');
    return baseEndpoint + actionEndpoint;
  }
}
