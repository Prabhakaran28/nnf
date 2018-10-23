/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';

import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';
import * as decode from 'jwt-decode';

@Component({
  selector: 'nb-change-password-page',
  styleUrls: ['./change-password.component.scss'],
  template: `
    <nb-auth-block>
      <h2 class="title">Change Password</h2>
      <small class="form-text sub-title">Enter your employee ID and reset your password!! After successful password reset, you will be directed to login page to login again!   </small>
      <form (ngSubmit)="changePass()" #changePassForm="ngForm">

        <div *ngIf="showMessages.error && errors && errors.length > 0 && !submitted"
             class="alert alert-danger" role="alert">
          <div *ngFor="let error of errors">{{ error }}</div>
        </div>
        <div *ngIf="showMessages.success && messages && messages.length > 0 && !submitted"
             class="alert alert-danger" role="alert">
          <div *ngFor="let message of messages">{{ message }}</div>
        </div>

      <div class="form-group">
        <input name="input-email" value={{user.email}} id="input-email" class="form-control" readonly>
        <br>
      </div>
<!--
        <div class="form-group">
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
          <small
          class="form-text error"
          *ngIf="email.touched && input-old-email.value != email.value && !email.errors?.required">
          User Id does not match. Please enter correct details! 
        </small>
          <br>
        </div> -->

        <div class="form-group">
        <label for="input-old-password" class="sr-only">Confirm Password</label>
        <input
          name="oldPass" [(ngModel)]="user.oldPassword" type="password" id="input-old-password"
          class="form-control form-control-lg last" placeholder="Old Password" #oldPass="ngModel"
          [required]="getConfigValue('forms.validation.password.required')">
        <small class="form-text error"
               *ngIf="oldPass.invalid && oldPass.touched && oldPass.errors?.required">
          Old Password confirmation is required!
        </small>
      </div>

        <div class="form-group">
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

      <div class="form-group">
        <label for="input-re-password" class="sr-only">Confirm Password</label>
        <input
          name="rePass" [(ngModel)]="user.confirmPassword" type="password" id="input-re-password"
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


        <button [disabled]="submitted || !changePassForm.form.valid" class="btn btn-hero-success btn-block"
                [class.btn-pulse]="submitted">
          Change password
        </button>
      </form>

      <div class="links col-sm-12">
        <small class="form-text">
          Already have an account? <a routerLink="../login"><strong>Sign In</strong></a>
        </small>
      </div>
    </nb-auth-block>
  `,
})
export class NbChangePasswordComponent {

  redirectDelay: number = 5000;
  showMessages: any = {};
  provider: string = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  token_Payload = decode(localStorage.getItem('auth_app_token'));

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected config = {},
    protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.requestPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.requestPassword.showMessages');
    this.provider = this.getConfigValue('forms.requestPassword.provider');
    this.user.email = this.token_Payload.email;
  }

  changePass(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.changePassword(this.provider, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = [result.getResponse().error.data.error];
      }

      const redirect = result.getRedirect();
      console.log(redirect);
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, 2000);
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
