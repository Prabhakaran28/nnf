/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';

import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';
import { NbUser } from '../../models/user';
import * as decode from 'jwt-decode';
 
@Component({
  selector: 'nb-forgot-password',
  template: `
    <nb-auth-block>
      <h2 class="title">Neural Front Forgot Password</h2>  
      <small *ngIf="token ==''" class="form-text sub-title">Enter Your Email ID, We will send the reset password link to your Email (if Valid)!! </small>
      <small *ngIf="token !=''" class="form-text sub-title"> Enter your User ID and new Password </small>

      <form (ngSubmit)="forgotPassword()" #form="ngForm" autocomplete="nope">

        <div *ngIf="showMessages.error && errors && errors.length > 0 && !submitted"
             class="alert alert-danger" role="alert">
          <div *ngFor="let error of errors">{{ error }}</div>
        </div>

        <div *ngIf="showMessages.success && messages && messages.length > 0 && !submitted && token =='' "
             class="alert alert-success" role="alert">
          <div *ngFor="let message of messages"><strong>{{ message }}</strong></div>
        </div>

        <div *ngIf="showMessages.success && messages && messages.length > 0 && !submitted && token != ''"
             class="alert alert-success" role="alert">
          <div><strong>Password Change Request has been submitted successfuly</strong></div>
        </div>

        <div *ngIf="token ==''"class="form-group">
          <label for="input-email" class="sr-only">Email address</label>
          <input name="email" [(ngModel)]="user.email" id="input-email" pattern=".+@.+\..+"
                 class="form-control" placeholder="Email address" #email="ngModel"
                 [class.form-control-danger]="email.invalid && email.touched" autofocus
                 [required]="getConfigValue('forms.validation.email.required')">
          <small class="form-text error" *ngIf="email.invalid && email.touched && email.errors?.required">
            Email is required!
          </small>
          <small class="form-text error"
                 *ngIf="email.invalid && email.touched && email.errors?.pattern">
            Email should be the real one!
          </small>
        </div>

        <!-- --> 

        <div *ngIf="token !=''" class="form-group">
        <label for="input-email" class="sr-only">Enter your email address</label>
        <input name="email" [(ngModel)]="user.email" id="input-email" #email="ngModel"
               class="form-control" placeholder="Confirm Email address" pattern=".+@.+\..+"
               [class.form-control-danger]="email.invalid && email.touched"
               [required]="getConfigValue('forms.validation.email.required')"
               autofocus>
        <small class="form-text error" *ngIf="email.invalid && email.touched && email.errors?.required">
          Email is required!
        </small>
        <small class="form-text error"
               *ngIf="email.invalid && email.touched && email.errors?.pattern">
          Email should be the real one!
        </small>
        <br>
      </div>

        
        <div *ngIf="token !=''" class="form-group">
        <label for="input-password" class="sr-only">New Password</label>
        <input name="password" [(ngModel)]="user.password" type="password" id="input-password"
               class="form-control form-control-lg first" placeholder="New Password" #password="ngModel"
               [class.form-control-danger]="password.invalid && password.touched"
               [required]="getConfigValue('forms.validation.password.required')"
               [minlength]="getConfigValue('forms.validation.password.minLength')"
               [maxlength]="getConfigValue('forms.validation.password.maxLength')"
               autofocus>
        <small class="form-text error" *ngIf="password.invalid && password.touched && password.errors?.required">
          Password is required!
        </small>
        <small
          class="form-text error"
          *ngIf="password.invalid && password.touched && (password.errors?.minlength || password.errors?.maxlength)">
          Password should contains
          from {{getConfigValue('forms.validation.password.minLength')}}
          to {{getConfigValue('forms.validation.password.maxLength')}}
          characters
        </small>
        <small
        class="form-text error"
        *ngIf="password.touched && oldPass.value == password.value && !password.errors?.required">
        Password cannot be same as Old Password! 
      </small>
        
      </div>

      <div *ngIf="token !=''" class="form-group">
        <label for="input-re-password" class="sr-only">Confirm Password</label>
        <input name="rePass" [(ngModel)]="user.confirmPassword" type="password" id="input-re-password"
          class="form-control form-control-lg last" placeholder="Confirm Password" #rePass="ngModel"
          [class.form-control-danger]="(rePass.invalid || password.value != rePass.value) && rePass.touched"
          [required]="getConfigValue('forms.validation.password.required')">
        <small class="form-text error"
               *ngIf="rePass.invalid && rePass.touched && rePass.errors?.required">
          Password confirmation is required!
        </small>
        <small
          class="form-text error"
          *ngIf="rePass.touched && password.value != rePass.value && !rePass.errors?.required">
          Password does not match the confirm password.
        </small>
      </div>


        <!-- -->

        <button *ngIf="token !=''" [disabled]="submitted" class="btn btn-block btn-hero-success"
                [class.btn-pulse]="submitted">
          Change Password
        </button>
        <button *ngIf="token ==''" [disabled]="submitted" class="btn btn-block btn-hero-success"
        [class.btn-pulse]="submitted">
        Send Password Link
        </button>
      </form>

    </nb-auth-block>
  `,
})
export class NbForgotPasswordComponent implements OnInit {

  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: NbUser = {};
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];
  token: string = '';
  token_Payload: any;
  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParams["tokenKey"]) {
      this.token = this.activatedRoute.snapshot.queryParams["tokenKey"];
      //console.log("token key in init"+this.token);
    }
    else {
      this.token = '';
    }
    this.token_Payload = decode(this.token);
  }

  constructor(protected service: NbAuthService, private activatedRoute: ActivatedRoute,
    @Inject(NB_AUTH_OPTIONS) protected config = {},
    protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.provider = this.getConfigValue('forms.login.provider');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
  }

  onLoad(): boolean
  {
    
    const date = new Date(0);
    date.setUTCSeconds(this.token_Payload.exp);
    if (new Date() < date) {
      console.log(date + "dsae");
    }

    return true;
  }

  forgotPassword(): void {


    this.errors = this.messages = [];
    this.submitted = true;

    if (this.token === '') {
      this.service.forgotPassword(this.provider, this.user).subscribe((result: NbAuthResult) => {
        this.submitted = false;
        if (result.isSuccess()) {
          this.messages = result.getMessages();
        } else {
          this.errors = [result.getResponse().error.data.error];
        }
        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, 2000);
        }
      });
    } else {

      if (this.user.email == this.token_Payload.email) {
        this.service.forgotPassword(this.provider, this.user).subscribe((result: NbAuthResult) => {
          this.submitted = false;
          if (result.isSuccess()) {
            this.messages = result.getMessages();
          } else {
            this.errors = [result.getResponse().error.data.error];
          }
          const redirect = result.getRedirect();
          if (redirect) {
            setTimeout(() => {
              return this.router.navigateByUrl(redirect);
            }, this.redirectDelay);
          }
        });
      }
      else {
        this.errors = ["Something wrong with your password change request. Please contact system Admin"];
      }
    }
  }
  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
